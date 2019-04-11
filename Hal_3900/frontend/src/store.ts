import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import { Theme, AppState, Store, BotResponse} from '@/components/types'
import uuid from 'uuid/v4'

Vue.use(Vuex)

export default new Vuex.Store<Store>({
  state: {
    messages: [
      {
        id: '0',
        from: 'bot',
        type: 'simple',
        body: 'Hello, welcome back!'
      }
    ],
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
    changeStatus(state, status) {
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
    sendMessage({commit, state}, payload) {
      let ready;
      
      ready.then(()=>{
        state.socket.send(JSON.stringify({
          type: 'message',
          error: false,
          text: payload
        }))
        commit('storeSentMessage', payload)
        commit('log', `sent: ${payload}`)
      })

    },
    sendTraining({state}, payload) {
      state.socket.send(JSON.stringify({
        type: 'training',
        error: false,
        choice: payload
      }))
    },
    //TOOD: this bull shit
    recv (res: MessageEvent) {
      const resObj:BotResponse = JSON.parse(res.data)
  
      if (!resObj) {
        this.$store.commit('log', `[ERROR] Recieved Empty Response`)
        return
      } else if (!resObj.data) {
        this.$store.commit('log', `[ERROR] Recieved Empty Data field in response`)
        return
      }
      this.$store.commit('log', `identified intent: ${resObj.data.intent}`)
      this.$store.commit('log', `got response: ${resObj.data.response}`)
      this.$store.commit('recvMessage', resObj.data.response)
      if (resObj.data.options && resObj.data.options.length > 0) {
        this.$store.commit('log', `got options: `)
        let i = 1
        for (let option of resObj.data.options) {
          this.$store.commit('log', `${i}. ${option.text} (${option._score})`)
          i++
        }
        this.$store.commit('recvOptions', resObj.data.options)
      }
  
    }
  }
})
