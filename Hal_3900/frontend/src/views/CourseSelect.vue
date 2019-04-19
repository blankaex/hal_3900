<template>
  <div class='course-select'>
    <h1 class="heading">Select a course</h1>
    <hr>
    <div class='card' v-for="course in $store.state.courses" :key="course.code" @click="select(course)">
      <h1 class='title'>{{course.code}}</h1>
      <small>{{course.name}}</small>
    </div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class CourseSelect extends Vue {
  select (course:string) {
    this.$store.commit('pickCourse', course)
    localStorage.setItem('course', course)
    this.$router.push({ name: 'home' })
  }
}
</script>

<style scoped lang='sass'>
.course-select
  width: calc(100% - 4rem)
  margin-top: 2rem
  margin-left: 2rem
  margin-right: 2rem
  display: flex
  flex-direction: row
  justify-content: space-around
  flex-wrap: wrap
  align-items: center
.heading
  width: 100%
  margin: 0px
  margin-bottom: 0.5rem
  margin-left: 2rem
  font-family: 'Raleway', sans-serif
hr
  width: 100%
  border: none
  outline: none
  height: 3px
  border-radius: 10px
  margin-bottom: 2rem
  background: linear-gradient(to right, #F15F79, #B24592)
.card
  background: white
  padding: 2rem 4rem
  border-radius: 10px
  transition: 0.3s
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)
  display: flex
  flex-direction: column
  text-align: center
  cursor: pointer
  margin-bottom: 2rem
.card:hover
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)
.card small
  font-family: 'Raleway', sans-serif
  color: #777
.card .title
  font-family: 'Raleway', sans-serif
  font-weight: 100
  font-size: 2.5rem
  margin: 0rem
  margin-bottom: 0.5rem
  background: linear-gradient(to right, #F15F79, #B24592)
  -webkit-background-clip: text
  -webkit-text-fill-color: transparent
</style>
