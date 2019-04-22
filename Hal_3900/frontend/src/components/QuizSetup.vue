<template>
  <div class="quizSetup">
    <h2>Select Course</h2>
    <v-select v-model='courseCode' :options='$store.state.courses' label='code' :reduce='course => course.code' />
    <div v-if="!isAdding">
      <QuizView v-if="courseCode" :courseCode="courseCode" @clicked='toggleView()'></QuizView>
    </div>
    <div v-if="isAdding && courseCode">
      <h2>Add new questions for {{ courseCode }}</h2>
      <QuizAdd v-if="courseCode" :courseCode="courseCode" @clicked='toggleView()'></QuizAdd>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import vSelect from 'vue-select'
import 'vue-select/src/scss/vue-select.scss'
import QuizAdd from './quiz/QuizAdd.vue'
import QuizView from './quiz/QuizView.vue'

@Component({
  components: {
    QuizAdd,
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

</style>
