<template>
  <div>
  <h2>Input new questions</h2>
  <form>
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
  </div>
</template>

<script lang='ts'>
  import {Prop, Vue} from 'vue-property-decorator'

interface Question {
  question: string,
  answer: string
}

export default class QuizAdd extends Vue {
  @Prop() courseCode!: string

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
    fetch(`http://${host}/api/quiz/add`, {
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
        // // TODO go to list of Qs for that course
        //   this.$forceUpdate()
        // } else {
        // // TODO show error message on page
      }
    })
  }
}


</script>

<style scoped>

</style>
