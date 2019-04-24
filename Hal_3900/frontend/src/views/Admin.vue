<template>
    <div class="admin">
       <CourseSetup/>
       <QuizSetup/>
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
    @extend %flex-row
    background: #FAFAFA
    width: 100vw
    overflow-x: hidden
</style>
