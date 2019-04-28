<template>
    <div class="admin">
      <QuizSetup/>
      <CourseSetup/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CourseSetup from '@/components/CourseSetup.vue'
import QuizSetup from '@/components/QuizSetup.vue'

@Component({
  components: {
    CourseSetup,
    QuizSetup
  }
})
export default class Admin extends Vue {}
</script>

<style scoped lang="sass">
  .admin
    @extend %flex-col
    @extend %font-stack
    background: #FAFAFA
    width: 100vw
    min-height: 100vh
    overflow-x: hidden
    justify-content: flex-start
</style>
