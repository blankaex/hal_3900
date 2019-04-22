<template>
  <div class="quizSetup">
    <h2>Select Course</h2>
    <v-select v-if='!isAdding' v-model='courseCode' :options='$store.state.courses' label='code' :reduce='course => course.code' />
<!--    TODO Make the lower part render once course selected.-->
    <QuizView v-if="courseCode" :courseCode="courseCode"></QuizView>
<!--    <QuizAdd v-if="isAdding && this.courseCode" :courseCode="this.courseCode"></QuizAdd>-->
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
  isAdding: boolean=false
}
</script>

<style scoped lang="sass">

</style>
