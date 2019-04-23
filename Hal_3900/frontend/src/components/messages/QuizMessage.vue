<template>
  <div class="quizMsg">
    <img src="../../assets/hal.png">
    <div v-if="message.body.question && message.body.answer" class="text"
         :style="{'background': getGradient(message.from)}">{{message.body.question}}</div>
<!--    TODO: "see answer" button reveals answer below-->
<!--    TODO: "next question" button loads next quiz Q if exists,  end of quiz message if last one-->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BotResponse, Theme } from './../types'

@Component
export default class QuizMessage extends Vue {
  @Prop() message:any

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
