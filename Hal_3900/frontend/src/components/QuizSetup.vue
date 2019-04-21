<template>
  <form>
    <h2>Select Course</h2>
    <v-select v-model='courseCode' :options='$store.state.courses' label='code' :reduce='course => course.code' />
    <h2>Input new questions</h2>
    <div class='newQuestions'>
      <div class='listItem' v-for='(item, index) in questions'>
        <input v-model='item.question' placeholder='Question'/>
        <input v-model='item.answer' placeholder='Answer'/>
        <button v-if='index>0' type='button' v-on:click='removeQuestion(index)'>-</button>
      </div>
      <button type='button' v-on:click='addQuestion()'>+</button>
    </div>
    <button type='submit' @click='sendNew()'>Add Questions</button>
</form>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import vSelect from 'vue-select'
import 'vue-select/src/scss/vue-select.scss'

Vue.component('v-select', vSelect)

  interface Question {
    question: string,
    answer: string
  }

export default class QuizSetup extends Vue {
  courseCode: string=''
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
    const host = this.$store.state.host
    fetch(`http://${host}/api/users/set`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        courseCode: this.courseCode,
        questions: this.questions
      })
    }).then(res => {
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
