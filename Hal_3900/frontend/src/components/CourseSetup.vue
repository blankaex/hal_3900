<template>
  <div v-if="submitted" class="confirmation">
    <p> Submitted Setup form </p>
  </div>
  <div v-else class="setup">
      <h1>Set up a new course</h1>
      <p>Enter the urls of pages on webcms3 below. Data will be taken from these pages and added to the chat database. Please allow time for the setup to complete: you can check up on the status here.</p>
      <form>
        <input type="text" v-model.trim="courseCode" placeholder="Course Code"/><br>
        <input type="text" v-model.trim="forum" placeholder="Forum URL"/><br>
        <input type="text" v-model.trim="outline" placeholder="Course Outline"/><br>
<!--        <input v-for="item in assignment" v-model="item.name" placeholder="name"/>-->
        <div :key="assignmentKey" class="expandingFields">
          <h3>assignments</h3>
          <div class="listItem" v-for="(item, index) in assignment">
            <input v-model.trim="item.name" placeholder="name"/>
            <input v-model.trim="item.address" placeholder="URL"/>
            <button type="button" v-on:click="removeAssignment(index)">-</button>
          </div>
          <button type="button" v-on:click="addAssignment()">+</button>
        </div>
        <div class="expandingFields">
          <h3>content pages</h3>
          <div class="listItem" v-for="(item, index) in content">
            <input v-model.trim="item.name" placeholder="name"/>
            <input v-model.trim="item.address" placeholder="URL"/>
            <button type="button" v-on:click="removeContent(index)">-</button>
          </div>
          <button type="button" v-on:click="addContent()">+</button>
        </div>
<!--        <input v-for="item in content" v-model.trim="item.name" @change.once="addContent()"/>-->
        <button type="submit" v-on:click.prevent="sendSetup()">GO</button>
     </form>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'

export default class CourseSetup extends Vue {
  submitted: boolean = false
  courseCode: string =''
  forum: string =''
  outline: string =''
  assignment: { name: string, address: string }[] = [
    { name: '', address: '' }
  ]
  content: { name: string, address: string }[] = [
    { name: '', address: '' }
  ]
  assignmentKey: number = 0
  contentKey: number = 0

  addAssignment () {
    this.assignment.push({ name: '', address: '' })
    this.assignmentKey++
    console.log(this.assignment)
  }

  removeAssignment (index: number) {
    this.assignment.splice(index, 1)
    this.assignmentKey--
    console.log(this.assignment)
  }

  addContent () {
    this.content.push({ name: '', address: '' })
    this.contentKey++
    console.log(this.content)
  }

  removeContent (index: number) {
    this.content.splice(index, 1)
    this.contentKey--
    console.log(this.content)
  }

  sendSetup () {
    // wrap form input as JS object matching pagesToScrape structure
    const courseCode = this.courseCode
    const forum = this.forum
    const outline = [{ "name": "course_outline", "address": this.outline}]
    const assignment = this.assignment
    const content = this.content

    const pagesToScrape = { courseCode, forum, outline, assignment, content }
    console.log(pagesToScrape);

    // get URL for backend API
    let host = 'backend.hal-3900.com'
    if (window.location.host !== 'hal-3900.com') {
      host = 'localhost:9447'
    }
    // post setup info to backend
    this.$http.post(`http://${host}/api/admin/setup`, { pagesToScrape })
      .then(res => {
        console.log(res)
        if (res.ok) {
          // TODO if backend response ok, show confirmation page
          this.submitted = true
        }
      })
  }
}
</script>

<style scoped lang="sass">
.setup
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  margin-top: auto
</style>
