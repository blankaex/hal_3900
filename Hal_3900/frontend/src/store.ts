import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import { Theme } from '@/components/types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    messages: [
      {
        id: 0,
        from: 'bot',
        text: 'Hello, welcome back!'
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
        secondaryGradient: ['#ff9068', '#fd746c'],
        primaryGradient: ['#5691c8', '#457fca']
      },
      {
        primary: '#f15f79',
        secondary: '#b24592',
        primaryGradient: ['#b24592', '#f15f79'],
        secondaryGradient: ['#136a8a', '#267871']
      }
    ]
  },
  mutations: {
    sendMessage (state, payload) {
      state.messages.push({
        id: moment().unix(),
        from: 'user',
        text: payload
      })
    },
    recvMessage (state, payload) {
      state.messages.push({
        id: moment().unix(),
        from: 'bot',
        text: payload
      })
    },
    changeTheme (state, payload) {
      const theme = state.themes.filter((x:Theme) => x.primary === payload)[0]
      state.theme = theme
    }
  },
  actions: {

  }
})
