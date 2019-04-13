import { AppState, BotResponse, Store, Theme } from '@/components/types'
import moment from 'moment'
import uuid from 'uuid/v4'
import Vue from 'vue'
import Vuex, { Commit } from 'vuex'

Vue.use(Vuex)

function messageHandler (commit: Commit, res: MessageEvent) {
  const resObj:BotResponse = JSON.parse(res.data)

  if (!resObj) {
    commit('log', `[ERROR] Recieved Empty Response`)
    return
  } else if (!resObj.data) {
    commit('log', `[ERROR] Recieved Empty Data field in response`)
    return
  }
  commit('log', `identified intent: ${resObj.data.intent}`)
  commit('log', `got response: ${resObj.data.response}`)
  commit('storeMessage', {
    type: 'simple',
    from: 'bot',
    body: resObj.data.response
  })

  if (resObj.data.options && resObj.data.options.length > 0) {
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
    state.socket = new WebSocket(state.socketURL)
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

function msg (payload: string):string {
  return JSON.stringify({
    type: 'message',
    error: false,
    text: payload
  })
}

function training (payload: string):string {
  return JSON.stringify({
    type: 'training',
    error: false,
    choice: payload
  })
}

export default new Vuex.Store<Store>({
  state: {
    user: null,
    messages: [
      {
        id: '0',
        from: 'bot',
        type: 'simple',
        body: 'Hello, welcome back!'
      }
    ],
    socketURL: process.env.PROD ? 'wsL//backend.hal-3900.com/talk' : 'ws://localhost:9447/talk',
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
      primary: '#fd746c',
      secondary: '#457fca',
      primaryGradient: ['#ff9068', '#fd746c'],
      secondaryGradient: ['#5691c8', '#457fca']
    },
    themes: [
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
    login(state, user) {
      state.user = user
    },
    logout(state, user) {
      state.user = null
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
    changeTheme (state, payload) {
      const theme = state.themes.filter((x:Theme) => x.primary === payload)[0]
      state.theme = theme
    },
    changeStatus (state, status) {
      state.status = status
    },
    log (state, payload) {
      state.log.push({
        id: uuid(),
        timestamp: moment(),
        message: payload
      })
    }
  },
  actions: {
    sendMessage ({ commit, state }, payload) {
      socketReady(state, commit)
        .then(() => state.socket!.send(msg(payload)))
      commit('storeMessage', {
        type: 'simple',
        from: 'user',
        body: payload
      })
      commit('log', `sent: ${payload}`)
    },
    sendTraining ({ state, commit }, payload) {
      socketReady(state, commit)
        .then(() => state.socket!.send(training(payload)))
      commit('log', `sent training data: ${payload}`)
    }
  }
})
