<template>
  <div v-if="courseCode" class='questionsList'>
    <h2>{{courseCode}}</h2>
    <table v-if="questions.length>0">
      <tr v-for='question in questions' :key='question.id'>
        <td>{{question.question}}</td>
        <td>{{question.answer}}</td>
        <td><button type='button' @click='remove(question.id)'>Delete</button></td>
      </tr>
    </table>
    <div v-else>There are no quiz questions yet for this course</div>
    <button type="button" @click="goToAdd()"> Add Questions </button>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'

interface Question {
  id: string,
  courseCode: string,
  tags: string[],
  question: string,
  answer: string
}
@Component
export default class QuizView extends Vue {
  @Prop() courseCode: any
  questions: Question[] = []

  goToAdd () {
    // switch down in prev view
    this.$emit('clicked', 'true')
  }
  remove (id:string) {
    const host = this.$store.state.host
    fetch(`http://${host}/api/quiz/delete/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then(r => r.json())
      .then(r => {
        console.log(r)
      })
  }
  mounted () {
    // get questions from API call
    const host = this.$store.state.host
    fetch(`http://${host}/api/quiz/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        courseCode: this.courseCode
      })
    }).then(r => r.json())
      .then(r => {
        this.questions = r
      })
  }
}

</script>

<style scoped>

</style>
