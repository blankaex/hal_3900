<template>
  <div class="quizMsg">
    <img src="../../assets/hal.png">
    <div v-if="message.body && message.body.question" class="text"
         :style="{'background': getGradient(message.from)}">{{message.body.question}}</div>
    <div v-else class="text"
      :style="{'background': getGradient(message.from)}">The Admin hasn't set any quiz questions for this course</div>
    <div v-if="showingAnswer && message.body.answer" class="text"
         :style="{'background': getGradient(message.from)}">{{message.body.answer}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BotResponse, Theme } from './../types'

@Component
export default class QuizMessage extends Vue {
  @Prop() message:any
  showingAnswer: boolean=false

  showAnswer () {
    this.showingAnswer = true
  }
  getGradient () {
    const theme:Theme = this.$store.state.theme
    const sg = theme.secondaryGradient
    return `linear-gradient(to right, ${sg[0]}, ${sg[1]})`
  }
}
</script>

<style scoped lang="sass">
  .quizMsg
    @extend %flex-row
    width: 100%
    margin-bottom: 0.5rem
    justify-content: flex-start
  .quizMsg img
    width: 48px
    height: 48px
    border-radius: 50%
    margin: 0.5rem
  .quizMsg .text
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
