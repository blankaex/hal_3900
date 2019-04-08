<template>
<div class="chat">
  <div class="messages" id="messages">
    <Message
      v-for="message in $store.state.messages"
      :key="message.id"
      :message="message">
    </Message>
    <LoadingAnim v-if="$store.state.status === AppState.PENDING"></LoadingAnim>
  </div>
  <div class="input" v-on:keydown.enter="send" >
    <input type="text"
      v-model="draft"
      :style="inputColor"
      @focus="inputFocused = true"
      @blur="inputFocused = false"
    />
    <ThemedIcon
      name="send"
      padding="0.5rem 0.5rem 0.5rem 0.75rem"
      margin="0rem 0rem 0rem 1rem"
      @click="send"></ThemedIcon>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BotResponse, Theme, AppState } from './types'
import ThemedIcon from './ThemedIcon.vue'
import Message from './Message.vue'

@Component({
  components: {
    ThemedIcon,
    Message
  }
})
export default class Chat extends Vue {
  draft: string = ''
  inputFocused: Boolean = false
  //TODO: move waiting/sopcket to be a redux items
  waiting: Boolean = false
  socket: WebSocket|null = null
  get inputColor () {
    if (!this.inputFocused) {
      return {}
    }
    return {
      'borderColor': this.$store.state.theme.primary,
      'color': this.$store.state.theme.primary
    }
  }

  //TODO: call this from render
  scrollEnd () {
    const container = this.$el.querySelector('#messages')
    if (container === null) return
    container.scrollTop = container.scrollHeight
  }

  // TODO: move send and recv to be vuex actions :D
  send () {
    if (this.draft.trim() === '') return
    if (!this.socket) throw Error("Socket hasn't been connected yet!")
    this.$store.commit('sendMessage', this.draft)
    this.$store.commit('log', `sent: ${this.draft}`)
    this.waiting = true
    this.socket.send(JSON.stringify({
      type: 'message',
      error: false,
      text: this.draft
    }))
    this.draft = ''
    this.scrollEnd()
  }

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
    this.waiting = false
    this.$nextTick(function () {
      this.scrollEnd()
    })
  }

  socketErr (err) {
    this.waiting = false
    console.dir(err)
  }

  mounted () {
    this.$nextTick(function () {
      // Are we running in dev mode?
      let host = 'backend.hal-3900.com'
      if (window.location.host !== 'hal-3900.com') {
        host = 'localhost:9447'
      }
      this.socket = new WebSocket(`ws://${host}/talk`)
      this.socket.onmessage = this.recv
      this.socket.onerror = this.socketErr
    })
  }
}
</script>

<style scoped lang="sass">
.chat
  @extend %flex-col
  margin-top: 2rem
  height: calc(100vh - 2rem)
  width: calc(100% - 2rem)
  margin-left: 1rem
  margin-right: 1rem
.messages
  width: 100%
  max-height: 100%
  overflow-y: scroll
  height: calc(100% - 5rem)
.input
  @extend %flex-center
  width: 100%
  height: 5rem
.input input
  height: 2rem
  border: 2px solid #EBEBEB
  background: none
  width: 90%
  border-radius: 15px
  padding-left: 1rem
  padding-right: 1rem
  color: #BBB
  font-size: 1rem
.input input:focus
  outline: none
  border-color: #fd746c
  color: #fd746c
</style>
