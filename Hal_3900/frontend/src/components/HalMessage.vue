<template>
  <div class="halMsg">
    <img src="../assets/hal.png">
    <div v-if="message.type == 'simple'" class="text"
      :style="{'background': getGradient(message.from)}">{{message.body}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BotResponse, Theme } from './types'

@Component
export default class HalMessage extends Vue {
  @Prop() message:any

  getGradient () {
    const theme:Theme = this.$store.state.theme
    const sg = theme.secondaryGradient
    return `linear-gradient(to right, ${sg[0]}, ${sg[1]})`
  }
}
</script>

<style scoped lang="sass">
.halMsg
  @extend %flex-row
  width: 100%
  margin-bottom: 0.5rem
  justify-content: flex-start
.halMsg img
  width: 48px
  height: 48px
  border-radius: 50%
  margin: 0.5rem
.halMsg .text
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
