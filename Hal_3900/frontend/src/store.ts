import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import { Theme } from '@/components/types'
import uuid from 'uuid/v4'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    messages: [
      {
        id: '0',
        from: 'bot',
        type: 'simple',
        body: 'Hello, welcome back!'
      }
    ],
    activeMessage: '0',
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
    sendMessage (state, payload) {
      const generatedUuid = uuid()
      state.messages.push({
        id: generatedUuid,
        type: 'simple',
        from: 'user',
        body: payload
      })
      state.activeMessage = generatedUuid
    },
    recvMessage (state, payload) {
      const generatedUuid = uuid()
      state.messages.push({
        id: generatedUuid,
        from: 'bot',
        type: 'simple',
        body: payload
      })
      state.activeMessage = generatedUuid
    },
    recvOptions (state, payload) {
      const generatedUuid = uuid()
      state.messages.push({
        id: generatedUuid,
        from: 'bot',
        type: 'options',
        body: payload
      })
      state.activeMessage = generatedUuid
    },
    changeTheme (state, payload) {
      const theme = state.themes.filter((x:Theme) => x.primary === payload)[0]
      state.theme = theme
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

  }
})
