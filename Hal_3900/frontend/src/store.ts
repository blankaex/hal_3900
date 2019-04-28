import { AppState, BotResponse, Store, Theme } from '@/components/types'
import moment from 'moment'
import uuid from 'uuid/v4'
import Vue from 'vue'
import Vuex, { Commit } from 'vuex'

Vue.use(Vuex)

function messageHandler (commit: Commit, res: MessageEvent) {
  const resObj:BotResponse = JSON.parse(res.data)
  commit('changeStatus', AppState.READY)
  if (!resObj) {
    commit('log', `[ERROR] Recieved Empty Response`)
    return
  } else if (!resObj.data) {
    commit('log', `[ERROR] Recieved Empty Data field in response`)
    return
  }

  commit('log', `identified intent: ${resObj.data.intent}`)
  commit('storeMessage', {
    type: 'simple',
    from: 'bot',
    body: resObj.data.response
  })

  if (resObj.data.intent === 'quiz') {
    // TODO handle quizzing stuff
    commit('log', `got quiz questions: `)
    resObj.data.options.map((o, i) => commit('log', `${i}. ${o.question}`))
    // TODO message "starting quiz on _____, hit enter when ready"
    commit('storeQuiz', {
      questions: resObj.data.options
    })
    commit('storeMessage', {
      type: 'quiz',
      from: 'bot',
      body: resObj.data.options[0]
    })
  } else if (resObj.data.options && resObj.data.options.length > 0) {
    commit('log', `got options: `)
    resObj.data.options.map((o, i) => commit('log', `${i}. ${o.text} (${o._score})`))
    commit('storeMessage', {
      type: 'options',
      from: 'bot',
      body: resObj.data.options
    })
  }
}

function errorHandler (commit: Commit, res: Event) {
  commit('log', `[ERROR] Websocket is having a right fit, see console for more info`)
  console.dir(res)
}

function get (url:string):Promise<Response> {
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  }).then(r => r.json())
}

/*
 * This is how we do lazy loading, until the first request is sent
 * the websocket is not connected.
 * Will reconnect if the socket has died.
 */
function socketReady (state: Store, commit: Commit):Promise<{}> {
  let ready = new Promise(resolve => resolve())
  const sock = state.socket
  if (sock === null || sock.readyState === sock.CLOSED || sock.readyState === sock.CLOSING) {
    if (sock && (sock.readyState === sock.CLOSED || sock.readyState === sock.CLOSING)) {
      commit('log', '[ERROR] Socket is closed? Reconnecting...')
    }
    state.socket = new WebSocket(`ws://${state.host}/talk?transport=websocket`)
    ready = new Promise(resolve => {
      state.socket!.onopen = resolve
      state.socket!.onmessage = (res:MessageEvent) => messageHandler(commit, res)
      state.socket!.onerror = (res:Event) => errorHandler(commit, res)
    })
  } else if (sock.readyState === sock.CONNECTING) {
    commit('log', '[ERROR] Socket is still connecting, dropping message :(')
  }
  return ready
}

function msg (course: string|null, payload: string):string {
  return JSON.stringify({
    type: 'message',
    course,
    error: false,
    text: payload
  })
}

function training (course: string|null, payload: string):string {
  return JSON.stringify({
    type: 'training',
    error: false,
    course,
    choice: payload
  })
}

function getUserFromStorage ():{name: string|null, admin: boolean|null} {
  const user = localStorage.getItem('user')
  if (user === null) return { name: null, admin: null }
  return JSON.parse(user)
}

export default new Vuex.Store<Store>({
  state: {
    user: getUserFromStorage(),
    course: localStorage.getItem('course'),
    messages: [
      {
        id: '0',
        from: 'bot',
        type: 'simple',
        body: 'Hello, welcome back!'
      }
    ],
    quiz: [],
    courses: [

    ],
    host: 'localhost:9447',
    socket: null,
    activeMessage: '0',
    status: AppState.READY,
    log: [
      {
        id: '0',
        timestamp: moment(),
        message: 'Logging started'
      }
    ],
    theme: {
      primary: '#F15F79',
      secondary: '#B24592',
      primaryGradient: ['#FFB75E', '#ED8F03'],
      secondaryGradient: ['#F15F79', '#B24592']
    },
    themes: [
      {
        primary: '#F15F79',
        secondary: '#B24592',
        primaryGradient: ['#FFB75E', '#ED8F03'],
        secondaryGradient: ['#F15F79', '#B24592']
      },
      {
        primary: '#fd746c',
        secondary: '#457fca',
        primaryGradient: ['#ff9068', '#fd746c'],
        secondaryGradient: ['#5691c8', '#457fca']
      },
      {
        secondary: '#fd746c',
        primary: '#457fca',
        primaryGradient: ['#5691c8', '#457fca'],
        secondaryGradient: ['#ff9068', '#fd746c']
      },
      {
        primary: '#f15f79',
        secondary: '#267871',
        primaryGradient: ['#b24592', '#f15f79'],
        secondaryGradient: ['#136a8a', '#267871']
      }
    ]
  },
  mutations: {
    login (state, user) {
      localStorage.setItem('user', JSON.stringify(user))
      state.user = user
    },
    logout (state) {
      state.user = { name: null, admin: null }
      state.course = null
      localStorage.removeItem('user')
      localStorage.removeItem('course')
    },
    storeMessage (state, payload) {
      const generatedUuid = uuid()
      state.messages.push({
        id: generatedUuid,
        type: payload.type,
        from: payload.from,
        body: payload.body
      })
      state.activeMessage = generatedUuid
    },
    storeQuiz (state, payload) {
      state.quiz.push(payload.questions)
    },
    changeTheme (state, payload) {
      const theme = state.themes.filter((x:Theme) => x.primary === payload)[0]
      state.theme = theme
    },
    changeStatus (state, status) {
      state.status = status
    },
    pickCourse (state, course) {
      state.course = course
      localStorage.setItem('course', course)
    },
    log (state, payload) {
      state.log.push({
        id: uuid(),
        timestamp: moment(),
        message: payload
      })
    },
    courseDump (state, payload) {
      state.courses = payload
    }
  },
  actions: {
    sendMessage ({ commit, state }, payload) {
      commit('changeStatus', AppState.PENDING)
      socketReady(state, commit)
        .then(() => state.socket!.send(msg(state.course, payload)))
      commit('storeMessage', {
        type: 'simple',
        from: 'user',
        body: payload
      })
      commit('log', `sent: ${payload}`)
    },
    sendTraining ({ state, commit }, payload) {
      socketReady(state, commit)
        .then(() => state.socket!.send(training(state.course, payload)))
      commit('log', `sent training data: ${payload}`)
    },
    init ({ state, commit }) {
      const host = state.host
      get(`http://${host}/api/admin/courses`)
        .then(r=>commit('courseDump', r))
    }
  }
})
