<template>
<div class="chat">
  <div class="messages" id="messages">
    <div :class="{'msg':true,
      'bot':message.from === 'bot',
      'user':message.from === 'user'
      }" v-for="message in $store.state.messages" :key="message.id">
        <img v-if="message.from === 'bot'" src="../assets/hal.png">
        <div class="text">{{message.text}}</div>
        <img v-if="message.from === 'user'" src="../assets/user.png">
    </div>
  </div>
  <div class="input" v-on:keydown.enter="send">
    <input type="text" v-model="draft"/>
    <i class="mdi mdi-send" @click="send"></i>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

interface BotResponse {
  text?: string,
  error: false,
  type: 'message'|'error'
}

@Component
export default class Chat extends Vue {
  draft: string = '';
  socket: WebSocket|null = null;

  scrollEnd () {
    const container = this.$el.querySelector('#messages')
    if (container === null) return
    container.scrollTop = container.scrollHeight
  }
  send () {
    if (this.draft.trim() === '') return
    if (!this.socket) return // TODO: actually throw a error here
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
    // TODO: Error handling
    this.$store.commit('recvMessage', resObj.text)
    this.$nextTick(function () {
      this.scrollEnd()
    })
  }
  mounted () {
    this.$nextTick(function () {
      const host = window.location.host;
      this.socket = new WebSocket(`ws://${host}/talk`)
      this.socket.onmessage = this.recv;
    })
  }
}
</script>

<style scoped lang="sass">
.chat
  @extend %flex-col
  margin-top: 2rem
  height: calc(100vh - 2rem)
  width: calc(60% - 2rem)
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
.input i
  margin-left: 1rem
  padding-top: 0.5rem
  padding-bottom: 0.5rem
  padding-right: 0.5rem
  padding-left: 0.75rem
  font-size: 1.5rem
  color: #777
  border-radius: 50%
  cursor: pointer
.input i:hover
  color: #ff9068
  background: rgba(255, 144, 104,0.1)
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
.bot .text
  background: #457fca
  background: -webkit-linear-gradient(to right, #5691c8, #457fca)
  background: linear-gradient(to right, #5691c8, #457fca)
.user .text
  background: #fd746c
  background: -webkit-linear-gradient(to right, #ff9068, #fd746c)
  background: linear-gradient(to right, #ff9068, #fd746c)
</style>
