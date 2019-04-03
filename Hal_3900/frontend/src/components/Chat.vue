<template>
<div class="chat">
  <div class="messages" id="messages">
    <div :class="{'msg':true,
      'bot':message.from === 'bot',
      'user':message.from === 'user'
      }" v-for="message in $store.state.messages" :key="message.id+'-'+message.from">
        <img v-if="message.from === 'bot'" src="../assets/hal.png">
        <div class="text" :style="{'background': getGradient(message.from)}">{{message.text}}</div>
        <img v-if="message.from === 'user'" src="../assets/user.png">
    </div>
      <div class="msg bot" v-if="waiting">
        <img src="../assets/hal.png">
        <div class="spinner">
          <div class="double-bounce1" :style="{'background-color': this.$store.state.theme.secondary}"></div>
          <div class="double-bounce2" :style="{'background-color': this.$store.state.theme.secondary}"></div>
        </div>
    </div>
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
import { BotResponse, Theme } from './types'
import ThemedIcon from './ThemedIcon.vue'

@Component({
  components: {
    ThemedIcon
  }
})
export default class Chat extends Vue {
  draft: string = ''
  socket: WebSocket|null = null
  inputFocused: Boolean = false
  waiting: Boolean = false

  get inputColor () {
    if (!this.inputFocused) {
      return {}
    }
    return {
      'borderColor': this.$store.state.theme.primary,
      'color': this.$store.state.theme.primary
    }
  }

  scrollEnd () {
    const container = this.$el.querySelector('#messages')
    if (container === null) return
    container.scrollTop = container.scrollHeight
  }

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
    this.waiting = false
    this.$nextTick(function () {
      this.scrollEnd()
    })
  }

  socketErr () {
    this.waiting = false
    // TODO: i dunno crash lol
  }

  getGradient (who:string) {
    const theme:Theme = this.$store.state.theme
    const pg = theme.primaryGradient
    const sg = theme.secondaryGradient
    if (who === 'user') {
      return `linear-gradient(to right, ${pg[0]}, ${pg[1]})`
    } else {
      return `linear-gradient(to right, ${sg[0]}, ${sg[1]})`
    }
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
.msg
  @extend %flex-row
  width: 100%
  margin-bottom: 0.5rem
.msg img
  width: 48px
  height: 48px
  border-radius: 50%
  margin: 0.5rem
.msg .text
  padding: 0.5rem 1rem
  position: relative
  font-family: 'Raleway', sans-serif
  border-radius: 10px
  color: white
  max-width: 60%
  white-space: pre-wrap
  white-space: -moz-pre-wrap
  white-space: -pre-wrap
  white-space: -o-pre-wrap
  word-wrap: break-word
.msg.bot .text::before
  content: "Hal"
  margin-top: -1.4rem
  position: absolute
  font-size: 0.8rem
  color: #BBB
.bot
  justify-content: flex-start
.user
  justify-content: flex-end

.spinner
  width: 40px
  height: 40px
  position: relative

.double-bounce1, .double-bounce2
  width: 100%
  height: 100%
  border-radius: 50%
  opacity: 0.6
  position: absolute
  top: 0
  left: 0
  -webkit-animation: sk-bounce 2.0s infinite ease-in-out
  animation: sk-bounce 2.0s infinite ease-in-out

.double-bounce2
  -webkit-animation-delay: -1.0s
  animation-delay: -1.0s

@-webkit-keyframes sk-bounce
  0%, 100%
    -webkit-transform: scale(0.0)
  50%
    -webkit-transform: scale(1.0)

@keyframes sk-bounce
  0%, 100%
    transform: scale(0.0)
    -webkit-transform: scale(0.0)
  50%
    transform: scale(1.0)
    -webkit-transform: scale(1.0)

</style>
