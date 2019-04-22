<template>
  <div v-if="courseCode" class='questionsList'>
    <h2>{{courseCode}}</h2>
    <table v-if="questions.length>0">
      <tr v-for='(question, index) in questions' :key='question.id'>
        <td>{{question.question}}</td>
        <td>{{question.answer}}</td>
<!--        <td><button type='button' @click='remove(index)'>Delete</button></td>-->
      </tr>
    </table>
    <div v-else>There are no quiz questions yet for this course</div>
    <button type="button"> Add Questions </button>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'

interface Question {
  question: string,
  answer: string
}
@Component
export default class QuizView extends Vue {
  @Prop() courseCode: any
  questions: Question[] = []

  mounted () {
    // get questions from API call
    const question = "Test Question"
    const answer = "Test Answer"
    // set in questions here.
    this.questions.push({ question, answer })
  }
}
</script>

<style scoped>

</style>
