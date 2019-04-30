<template>
  <div class="quizMsg">
    <img src="../../assets/hal.png">
    <div class="grouped">
      <div v-if="message.body && message.body.question" class="text"
          :style="{'background': getGradient(message.from)}">{{message.body.question}}</div>
      <div v-else class="text"
        :style="{'background': getGradient(message.from)}">The Admin hasn't set any quiz questions for this course and/or that topic</div>
      <div class="row">
          <div v-if="message.body && message.body.answer" :class="{'text': true, 'hidden': !showingAnswer}"
          :style="{'background': getGradient(message.from)}">{{message.body.answer}}</div>
          <i v-if="!showingAnswer" class="mdi mdi-eye" @click="showingAnswer = true"></i>
          <i v-else class="mdi mdi-eye-off" @click="showingAnswer = false"></i>
      </div>
      <p v-if="$store.state.activeMessage === message.id"> Did you get it right?
        <span @click="trainQuiz(true)" :style="getPrimary()">yes</span>
        <span @click="trainQuiz(false)" :style="getPrimary()">no</span></p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BotResponse, Theme } from './../types'

@Component
export default class QuizMessage extends Vue {
  @Prop() message:any
  showingAnswer: boolean=false

  trainQuiz (result:boolean) {
    this.$store.commit('storeMessage', {
      type: 'simple',
      from: 'bot',
      body: result ? 'Good job!' : 'Good try! Keep practicing'
    })
    this.$store.dispatch('sendQuizTraining', {
      user: this.$store.state.user.name,
      questionId: this.message.body.id,
      correct: result
    })
  }

  getPrimary () {
    return {
      color: this.$store.state.theme.secondary
    }
  }

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
  .grouped
    @extend %flex-col
    align-items: flex-start
    justify-content: flex-start
    width: 100%
  .grouped p
    margin-left: 1rem
    color: #777
    font-family: 'Raleway', sans-serif
  .grouped span
    margin: 0rem 0.5rem
    cursor: pointer
  .grouped span:hover
    text-decoration: underline
  .quizMsg img
    width: 48px
    height: 48px
    border-radius: 50%
    margin: 0.5rem
  .quizMsg .text
    padding: 0.5rem 1rem
    margin-top: 0.5rem
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
    transition: all 0.3s
  .quizMsg .text.hidden
    color: transparent
    text-shadow: 0 0 7px rgba(255,255,255,1)
  .row
    @extend %flex-row
    width: 100%
    justify-content: flex-start
    align-items: center
  .row i
    margin-top: 0.5rem
    color: #BBB
    margin-left: 1rem
    cursor: pointer
    font-size: 1.2rem
  .row i:hover
    color: #777
</style>
