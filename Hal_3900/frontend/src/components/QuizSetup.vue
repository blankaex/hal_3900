<template>
  <div class="quiz-setup">
    <h1>Course Management</h1>
    <hr>
    <p>Select a course from the dropdown to add quiz questions and see information about the course</p>
    <div class="selector-container">
      <v-select v-model='courseCode' :options='$store.state.courses' label='code' :reduce='course => course.code' />
    </div>
    <div class="row">
      <div v-if="courseCode" class="card">
        <h3>{{courseCode}} Quiz Questions</h3>
        <hr>
        <QuizView :courseCode="courseCode" @clicked='toggleView()'></QuizView>
      </div>
      <div v-if="courseCode" class="card">
        <h3>{{courseCode}} Stats</h3>
        <hr>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import vSelect from 'vue-select'
import 'vue-select/src/scss/vue-select.scss'
import QuizView from './quiz/QuizView.vue'

@Component({
  components: {
    QuizView,
    vSelect
  }
})

export default class QuizSetup extends Vue {
  isAdding: boolean=false
  courseCode: string=''

  toggleView () {
    this.isAdding = !this.isAdding
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
</style>
