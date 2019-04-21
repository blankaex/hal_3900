<template>
<!--  TODO add selection field for which course-->
  <div class='newQuestions'>
    <form>
      <div class='listItem' v-for='(item, index) in questions'>
        <input v-model='item.question' placeholder='Question'/>
        <input v-model='item.answer' placeholder='Answer'/>
        <button v-if='index>0' type='button' v-on:click='removeQuestion(index)'>-</button>
      </div>
      <button type='button' v-on:click='addQuestion()'>+</button>
    </form>

  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import 'vue-resource/types/vue'

interface Question {
  question: string,
  answer: string
}

export default class QuizSetup extends Vue {
  questions: Question[] = [
    {
      question: '',
      answer: ''
    }
  ]

  addQuestion () {
    this.questions.push({ question: '', answer: '' })
    this.$forceUpdate()
  }

  removeQuestion (index: number) {
    this.questions.splice(index, 1)
    this.$forceUpdate()
  }

  sendNew () {
    // TODO send coursecode + array of new questions to add
    // Use select from list of available courses to add questions to
    const courseCode = ''
    const questions = this.questions
    const newQuestions = { courseCode, questions }
    // get URL for backend API
    let host = 'backend.hal-3900.com'
    if (window.location.host !== 'hal-3900.com') {
      host = 'localhost:9447'
    }
    // post new questions to backend
    this.$http.post(`http://${host}/api/quiz/add`, { newQuestions })
      .then(res => {
        console.log(res)
        if (res.ok) {
          // TODO go to list of Qs for that course
          this.$forceUpdate()
        } else {
          // TODO show error message on page
        }
      })
  }
}
</script>

<style scoped lang="sass">

</style>
