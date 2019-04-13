<template>
    <div class="setup">
      <form>
        <input type="text" v-model.trim="courseCode" placeholder="Course Code"/>
        <input type="text" v-model.trim="forum" placeholder="Forum URL"/>
<!--        <input type="text" v-model.trim="outline.item" placeholder="Course Outline"/>-->
<!--        <input v-for="item in assignment" v-model.trim="item.name" @change.once="addAssignment()"/>-->
<!--        <input v-for="item in content" v-model.trim="item.name" @change.once="addContent()"/>-->
        <button type="submit" v-on:click.prevent="send()">SUBMIT</button>
     </form>
    </div>
</template>

<script lang="ts">
  import { Vue } from 'vue-property-decorator'

  export default class CourseSetup extends Vue {
    courseCode: string =''
    forum: string=''
    // outline: [{
    //   name: '',
    //   url: ''
    // }]
    // assignment: [{
    //   name: '',
    //   url: ''
    // }]
    // content: [{
    //   name: '',
    //   url: ''
    // }]
    // addAssignment() {
    //   this.assignment.push({ name: '', url: '' })
    // }
    // addContent() {
    //   this.content.push({ name: '', url: '' })
    // }
    send() {
      let host = 'backend.hal-3900.com'
      if (window.location.host !== 'hal-3900.com') {
        host = 'localhost:9447'
      }
      //TODO make sure wrapped as correct formatted JS object
      //TODO post to backend API (not set up yet)
      //TODO then load confirmation page w/option to go back to admin
    }
  }
</script>

<style scoped>

</style>
