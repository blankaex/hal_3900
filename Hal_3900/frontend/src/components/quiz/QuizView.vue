<template>
  <div v-if="courseCode" class='questionsList'>
    <div class="scrollable">
      <div class="row" v-for='(question) in questions' :key='question._id'>
        <div class="text">{{question.question}}</div>
        <div class="text">{{question.answer}}</div>
        <div class="icon"><i class="mdi mdi-minus-circle-outline" @click='remove(question.id)'></i></div>
      </div>
    </div>
    <p> Enter a new question in below </p>
    <div class='newQuestions'>
      <input type="text" v-model='newQuestion' placeholder='Question'/>
      <input type="text" v-model='newAnswer' placeholder='Answer'/>
      <i class="mdi mdi-plus-circle-outline" v-on:click='sendNew()'></i>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'

interface Question {
  id: string,
  courseCode: string,
  question: string,
  answer: string
}

function post (url:string, data:object):Promise<Question[]> {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(data)
  }).then(r => r.json())
}

@Component
export default class QuizView extends Vue {
  @Prop() courseCode: any
  questions: Question[] = []
  newQuestion: string = ''
  newAnswer: string = ''

  sendNew () {
    if (this.courseCode && this.newQuestion && this.newAnswer) {
      const host = this.$store.state.host
      fetch(`http://${host}/api/quiz/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          courseCode: this.courseCode,
          questions: [
            {
              question: this.newQuestion,
              answer: this.newAnswer
            }
          ]
        })
      }).then(res => res.json())
        .then(res => {
          this.refresh()
          console.log(res)
        })
    }
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
        this.questions = this.questions.filter(x => x.id !== id)
        console.log(r)
      })
  }
  refresh () {
    const host = this.$store.state.host
    post(`http://${host}/api/quiz/`, { courseCode: this.courseCode })
      .then(r => { this.questions = r })
  }
  mounted () {
    this.refresh()
  }
}

</script>

<style scoped lang="sass">
.questionsList
  width: 100%
  margin-top: 1rem
p
  color: #555
  margin-bottom: 1rem
.scrollable
  width: calc(100% - 1rem)
  height: 250px
  padding: 0.5rem
  overflow: scroll
  border: 1px solid #EBEBEB
  border-radius: 15px
  margin-bottom: 1rem
  background: rgba(0,0,0,0.02)
.add
  width: 100%
  border-radius: 15px
  border: none
  background: rgba(0,0,0,0.05)
  color: #444
  cursor: pointer
  transition: all 0.2s
.add:hover
  box-shadow: 0 2px 3px rgba(0,0,0,0.19), 0 1px 2px rgba(0,0,0,0.23)
.mdi.mdi-minus-circle-outline, .card.content .mdi.mdi-minus-circle-outline
  color: #777
  cursor: pointer
  font-size: 1.1rem
.mdi.mdi-minus-circle-outline:hover, .card.content .mdi.mdi-minus-circle-outline:hover
  color: #F15F79
.row
  width: 100%
  display: flex
.row .text
  width: calc(45% - 2rem)
  padding: 0.3rem 1rem
  border-right: 1px solid #BBB
  color: #444
.row .icon
  width: calc(10%-2rem)
  padding: 0rem 1rem
.newQuestions
  width: 100%
  display: flex
  align-items: center
.newQuestions i
  color: #777
  font-size: 1.3rem
  cursor: pointer
.newQuestions i:hover
  color: #F15F79
.newQuestions input[type='text']
  padding: 0.2rem 0.5rem
  width: 38%
  border-radius: 8px
  border: 2px solid #EBEBEB
  color: #444
  margin-right: 0.5rem
.newQuestions input[type='text']:focus
  outline: none
  border-color: #F15F79
</style>
