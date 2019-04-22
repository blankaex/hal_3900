<template>
  <div class="quizSetup">
    <h2>Select Course</h2>
    <v-select v-model='courseCode' :options='$store.state.courses' label='code' :reduce='course => course.code' />
    <QuizAdd v-if="isAdding" :courseCode="courseCode"></QuizAdd>
    <QuizView v-else :courseCode="courseCode"></QuizView>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import vSelect from 'vue-select'
import 'vue-select/src/scss/vue-select.scss'
import QuizAdd from './quiz/QuizAdd.vue'
import QuizView from './quiz/QuizView.vue';

@Component({
  components: {
    QuizAdd,
    QuizView,
    vSelect
  }
})

export default class QuizSetup extends Vue {
  courseCode: string=''
  isAdding: boolean=true
}
</script>

<style scoped lang="sass">

</style>
