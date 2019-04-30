<template>
  <div class="quiz-setup">
    <h1>Course Management</h1>
    <hr>
    <p>Select a course from the dropdown to add quiz questions and see information about the course</p>
    <div class="selector-container">
      <v-select v-model='courseCode' :options='$store.state.courses.map(x => x.courseCode)' label='courseCode' />
    </div>
    <div class="row">
      <div v-if="courseCode" class="card">
        <h3>{{courseCode}} Quiz Questions</h3>
        <hr>
        <QuizView :courseCode="courseCode" :key="courseCode"></QuizView>
      </div>
      <div v-if="courseCode" class="card settings" :key="courseCode">
        <h3>{{courseCode}} Settings</h3>
        <hr>
        <h5> Confidence Threshold </h5>
        <p> This is just the minimum score a data point must score to be considered
          the correct answer for a question. If no data point meets this, hal will display the top 4 guesses
          and ask for feedback </p>
        <div class="slider-container">
          <input v-model="confidence" type="range" class="slider" min="1" max="100"/>
          <input type="text" readonly :value="confidence"/>
        </div>
        <h5> Training Sensitivity </h5>
        <p> This is how sensitive the bot should be to feedback, a large value means the
          bot will adjust response weights a lot more dramatically after a user gives feedback</p>
        <div class="slider-container">
          <input v-model="sensitivity" type="range" class="slider" min="1" max="100"/>
          <input type="text" readonly :value="sensitivity/100"/>
        </div>
        <br>
        <div class="action-set">
          <button @click="shoot"> save </button>
        </div>
      </div>
    </div>
    <StatsView v-if="courseCode" :courseCode="courseCode" :key="courseCode"></StatsView>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import vSelect from 'vue-select'
import 'vue-select/src/scss/vue-select.scss'
import QuizView from './quiz/QuizView.vue'
import StatsView from './StatsView.vue'

function post (url:string, data:object):Promise<Response> {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(data)
  })
}

function get (url:string):Promise<Response> {
  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  })
}

@Component({
  components: {
    QuizView,
    StatsView,
    vSelect
  }
})
export default class QuizSetup extends Vue {
  courseCode: string=''
  confidence: number=1
  sensitivity: number=1
  previous: string=''

  shoot () {
    const host = this.$store.state.host
    post(`http://${host}/api/admin/settings`, {
      courseCode: this.courseCode,
      confidence: this.confidence,
      sensitivity: this.sensitivity / 100
    })
  }

  updated () {
    this.$nextTick(function () {
      if (this.previous !== this.courseCode) {
        this.previous = this.courseCode
      } else {
        return
      }
      if (!this.courseCode) return
      const host = this.$store.state.host
      get(`http://${host}/api/admin/settings/${this.courseCode}`)
        .then(r => r.json())
        .then(r => {
          this.confidence = r.confidence
          this.sensitivity = r.sensitivity * 100
        })
    })
  }
}
</script>

<style scoped lang="sass">
.quiz-setup
  width: calc(100% - 4rem)
  margin: 0rem 2rem
.quiz-setup hr
  width: 100%
  border: none
  outline: none
  height: 3px
  border-radius: 10px
  background: linear-gradient(to right, #F15F79, #B24592)
.quiz-setup h1
  width: 100%
  color: #444
  text-align: left
  margin-bottom: 0.2rem

p
  color: #555
  margin-bottom: 1rem
.selector-container
  width: 10rem
.card
  width: 500px
  height: 450px
  overflow: scroll
  padding: 1rem
  margin-top: 1rem
  background: white
  border-radius: 10px
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)
  display: flex
  flex-direction: column
.card h3
  margin: 0px
  font-weight: 100
.row
  width: 100%
  margin-top: 1rem
  display: flex
  flex-direction: row
  justify-content: space-around
  flex-wrap: wrap
.row-center
  width: 100%
  margin-top: 1rem
  display: flex
  flex-direction: row
  justify-content: center
.settings h5
  margin: 0.5rem 0rem
  margin-top: 1rem
  color: #444
  font-size: 1rem
.settings p
  margin: 0px
  color: #777
  font-size: 0.8rem
.slider-container
  @extend %flex-row
  margin: 1rem 0rem
  align-items: center
  width: 100%
  height: 2rem
.slider-container input[type="text"]
  padding: 0.2rem .5rem
  margin-left: 2rem
  border-radius: 15px
  border: 2px solid #EBEBEB
  background: rgba(0, 0, 0, 0.02)
  color: #444
  width: 3rem
  text-align: center
.slider-container input[type="text"]:focus
  outline: none
.slider
    width: 75%
    -webkit-appearance: none
    appearance: none
    background: #EBEBEB
    height: 0.5rem
    border-radius: 10px
    outline: none
.slider::-webkit-slider-thumb
    -webkit-appearance: none
    appearance: none
    width: 15px
    height: 15px
    border-radius: 50%
    background: rgb(236, 0, 140)
    cursor: pointer
.slider::-moz-range-thumb
    width: 25px
    height: 25px
    border-radius: 50%
    background: #F15F79
    cursor: pointer
.action-set
  width: calc(100%-4rem)
  margin: 0rem 1rem
  margin-top: 2rem
  display: flex
  align-items: center
  justify-content: flex-end
button
  outline: none
  border: none
  border-radius: 15px
  padding: 0.4rem 1.2rem
  font-size: 0.8rem
  background: linear-gradient(to right, #F15F79, #B24592)
  color: white
  cursor: pointer
  width: 6rem
  transition: all 0.3s cubic-bezier(.25,.8,.25,1)
button:hover
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)
button:focus
  outline: none
</style>
