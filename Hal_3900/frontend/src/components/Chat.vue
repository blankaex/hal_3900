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
  </div>
  <div class="input" v-on:keydown.enter="send" >
    <input type="text"
      v-model="draft"
      :style="inputColor"
      @focus="inputFocused = true"
      @blur="inputFocused = false"
    />
    <ThemedIcon name="send" @click="send"></ThemedIcon>
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
    this.$store.commit('recvMessage', resObj.text)
    this.$nextTick(function () {
      this.scrollEnd()
    })
  }

  socketErr () {
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
  padding-left: 1rem
  padding-right: 1rem
  padding-top: 0.5rem
  padding-bottom: 0.5rem
  font-family: 'Raleway', sans-serif
  border-radius: 10px
  color: white
  max-width: 60%
.bot
  justify-content: flex-start
.user
  justify-content: flex-end
</style>
