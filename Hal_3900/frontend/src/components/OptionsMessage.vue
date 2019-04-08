<template>
  <div class="halMsg">
    <img src="../assets/hal.png">
    <div class="options" :style="{'background': getGradient()}">
        <div class="item" v-for="(option,i) in options" :key="option._id">
          <div class="selectBest" @click="selectBest(option,i, message.id)"></div>{{option.text.trim()}}</div>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BotResponse, Theme } from './types'

@Component
export default class OptionsMessage extends Vue {
  @Prop() options:any

  // TODO: move socket logic to redux layer
  selectBest (choice:any, choiceIndex:number, messageId: string) {
    if (this.$store.state.activeMessage !== messageId) return
    if (!this.socket) throw Error("Socket hasn't been connected yet!")
    this.$store.commit('sendMessage', choiceIndex)
    this.socket.send(JSON.stringify({
      type: 'training',
      error: false,
      choice
    }))
    this.$store.commit('recvMessage', 'Thanks!')
  }

  getGradient () {
    const theme:Theme = this.$store.state.theme
    const sg = theme.secondaryGradient
    return `linear-gradient(to right, ${sg[0]}, ${sg[1]})`
  }
}
</script>

<style scoped lang="sass">
 .options
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
</style>
