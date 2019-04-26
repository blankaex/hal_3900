<template>
<div class="course-setup">
  <!-- TODO: Make this a modal -->
  <div v-if='submitted' class='confirmation'>
    <p> Submitted Setup form </p>
  </div>

  <div class='setup'>
      <h1>Set up a new course</h1>
      <hr>
      <p>Enter the urls of pages on webcms3 below. Data will be taken from these pages and added to the chat database. Please allow time for the setup to complete: you can check up on the status here.</p>
      <div class="form">
        <div class='card general-info'>
          <h3> General Information </h3>
          <hr><br>
          <label>Course code</label>
          <input type='text' v-model.trim='courseCode' placeholder='COMP0000'/>
          <label>Course Name</label>
          <input type='text' v-model.trim='courseName' placeholder='Intro to Python'/>
          <label>Course Forum Link</label>
          <input type='text' v-model.trim='forum' placeholder='https://webcms3.cse.unsw.edu.au/....'/>
          <label>Course Outline Link</label>
          <input type='text' v-model.trim='outline' placeholder='https://webcms3.cse.unsw.edu.au/....'/>
        </div>
        <div class='card assignments'>
          <h3> Assignments </h3>
          <hr><br>
          <div class="scrollable">
            <div class='listItem' v-for='(item, index) in assignment' :key="index">
              <input type='text' v-model.trim='item.name' placeholder='name'/>
              <input type='text' v-model.trim='item.address' placeholder='URL'/>
              <i class="mdi mdi-plus-circle-outline" type='button' v-on:click='removeAssignment(index)'></i>
            </div>
          </div>
          <button class="add" type='button' v-on:click='addAssignment()'>+</button>
        </div>
        <div class='card content'>
          <h3>content pages</h3>
          <hr><br>
          <div class="scrollable">
            <div class='listItem' v-for='(item, index) in content' :key="index">
              <input type="text" v-model.trim='item.name' placeholder='name'/>
              <input type="text" v-model.trim='item.address' placeholder='URL'/>
              <button type='button' v-on:click='removeContent(index)'>-</button>
            </div>
          </div>
          <button class="add" type='button' v-on:click='addContent()'>+</button>
        </div>
        </div>
    <button type='submit' v-on:click='sendSetup()'>GO</button>
  </div>
</div>
</template>

<script lang='ts'>
import { Vue } from 'vue-property-decorator'

interface Link {
  name: string,
  address: string
}

export default class CourseSetup extends Vue {
  submitted: boolean = false
  courseCode: string =''
  courseName: string =''
  forum: string =''
  outline: string =''
  assignment: Link[] = [
    {
      name: '',
      address: ''
    }
  ]
  content: Link[] = [
    {
      name: '',
      address: ''
    }
  ]

  addAssignment () {
    this.assignment.push({ name: '', address: '' })
    this.$forceUpdate()
  }

  removeAssignment (index: number) {
    this.assignment.splice(index, 1)
    this.$forceUpdate()
  }

  addContent () {
    this.content.push({ name: '', address: '' })
    this.$forceUpdate()
  }

  removeContent (index: number) {
    this.content.splice(index, 1)
    this.$forceUpdate()
  }

  sendSetup () {
    // TODO add new courses to store
    // wrap form input as JS object matching pagesToScrape structure
    const courseCode = this.courseCode
    const forum = this.forum
    const outline = [
      {
        'name': 'course_outline',
        'address': this.outline
      }
    ]
    const assignment = this.assignment
    const content = this.content

    const pagesToScrape = { courseCode, forum, outline, assignment, content }
    const host = this.$store.state.host
    fetch(`http://${host}/api/admin/setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ pagesToScrape })
    }).then(res => {
      console.log(res)
      if (res.ok) {
        // TODO: if backend response ok, show confirmation page
        this.submitted = true
      }
      this.$forceUpdate()
    })
  }
}
</script>

<style scoped lang='sass'>
.course-setup
  width: calc(100% - 4rem)
  margin: 0rem 2rem
.course-setup hr
  width: 100%
  border: none
  outline: none
  height: 3px
  border-radius: 10px
  background: linear-gradient(to right, #F15F79, #B24592)
.course-setup h1
  width: 100%
  color: #444
  text-align: left
  margin-bottom: 0.2rem
.course-setup p
  color: #555
  margin-bottom: 1rem
.form
  width: 100%
  @extend %flex-row
  justify-content: space-around
  flex-wrap: wrap
.card
  width: 350px
  height: 350px
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
.card.general-info input[type='text']
  padding: 0.4rem 1rem
  border-radius: 15px
  border: 2px solid #EBEBEB
  color: #444
  width: 15rem
  margin-bottom: 1rem
.card.general-info input[type='text']:focus
  outline: none
  border-color: #F15F79
.card label
  font-size: 0.8rem
  color: #777
  margin-left: 1rem
  margin-bottom: 0.2rem
.add
  width: 100%
  border-radius: 15px
  border: none
  background: rgba(0,0,0,0.05)
  color: #444
  cursor: pointer
  transition: all 0.2s
.add:hover
  box-shadow: 0 2px 3px rgba(0,0,0,0.19), 0 1px 2px rgba(0,0,0,0.23)
.listItem
  @extend %flex-row
  margin-bottom: 0.5rem
  justify-content: flex-start
.card.assignments input[type='text'], .card.content input[type='text']
  padding: 0.2rem 0.5rem
  border-radius: 8px
  border: 2px solid #EBEBEB
  color: #444
  margin-right: 0.5rem

.card.assignments .mdi.mdi-minus-circle-outline, .card.content .mdi.mdi-minus-circle-outline
  color: #444

.card.assignments input[type='text']:focus, .card.content input[type='text']:focus
  outline: none
  border-color: #F15F79

.scrollable
  width: calc(100% - 1rem)
  height: 250px
  padding: 0.5rem
  overflow: scroll
  border: 1px solid #EBEBEB
  border-radius: 15px
  margin-bottom: 1rem
  background: rgba(0,0,0,0.02)
button:focus
  outline: none
</style>
