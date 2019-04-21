<template>
    <div class="admin">
       <CourseSetup/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CourseSetup from '@/components/CourseSetup.vue'

@Component({
  components: {
    CourseSetup
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
