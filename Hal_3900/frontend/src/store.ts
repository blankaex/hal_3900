import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    messages: [
      {
        id: 0,
        from: 'bot',
        text: 'Hello, welcome back!'
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
    }
  },
  actions: {

  }
})
