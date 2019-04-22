<template>
  <div class='questionsList'>
    <h2>{{courseCode}}</h2>
    <table>
      <tr v-for='(question, index) in questions'>
        <td>{{question.question}}</td>
        <td>{{question.answer}}</td>
<!--        <td><button type='button' @click='remove(index)'>Delete</button></td>-->
      </tr>
    </table>
  </div>
</template>

<script lang='ts'>
import { Prop, Vue } from 'vue-property-decorator'

interface Question {
  question: string,
  answer: string
}

export default class QuizView extends Vue {
  @Prop() courseCode!: string
  questions: Question[] = []

  mounted () {
    // get questions from API call

    // set in questions here.
    // this.questions
  }
}
</script>

<style scoped>

</style>
