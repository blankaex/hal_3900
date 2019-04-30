<template>
  <div v-if="courseCode" class='statsList'>
    <div v-if="courseCode" class="card">
      <h3>{{courseCode}} Student Interactions</h3>
      <hr>
      <div class="container">
        <PieChart v-if="loaded" :pieNums="[stats.quizTotal, stats.queryTotal, stats.missedQuery]"></PieChart>
      </div>
    </div>
    <div v-if="courseCode" class="card">
      <h3>{{courseCode}} Frequently asked question keywords</h3>
      <hr>
      <div class="container">
        <BarChart v-if="loaded" :tagCounts="stats.queryCounts"></BarChart>
      </div>
    </div>
    <div v-if="courseCode" class="card">
      <h3>{{courseCode}} Frequently asked quiz keywords:</h3>
      <hr>
      <div class="container">
        <BarChart v-if="loaded" :tagCounts="stats.quizCounts"></BarChart>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import PieChart from "./stats/PieChart.vue";
import BarChart from "./stats/BarChart.vue";

interface Stats {
  queryCounts: [],
  quizCounts: [],
  queryTotal: number,
  missedQuery: number,
  quizTotal: number
}

function post (url:string, data:object):Promise<Stats> {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(data)
  }).then(r => r.json())
}
@Component({
  components: {
    BarChart,
    PieChart
  }
})
export default class StatsView extends Vue {
  @Prop() courseCode: any
  loaded: boolean=false
  stats: Stats = {
    queryCounts: [],
    quizCounts: [],
    queryTotal: 0,
    missedQuery: 0,
    quizTotal: 0
  }

  refresh () {
    // retrieve stats for course
    const host = this.$store.state.host
    post(`http://${host}/api/course/stats`, { courseCode: this.courseCode })
      .then(r => {
        this.stats.queryCounts = r.queryCounts
        this.stats.quizCounts = r.quizCounts
        this.stats.queryTotal = r.queryTotal
        this.stats.quizTotal = r.quizTotal
        this.stats.missedQuery = r.missedQuery
        this.loaded = true
      })
  }
  mounted () {
    this.refresh()
  }
}

</script>

<style scoped lang="sass">
.statsList
  @extend %flex-row
  width: 100%
  margin-top: 1rem
  justify-content: space-around
  flex-wrap: wrap
p
  color: #555
  margin-bottom: 1rem
.card
  width: 500px
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
hr
  width: 100%
  border: none
  outline: none
  height: 3px
  border-radius: 10px
  background: linear-gradient(to right, #F15F79, #B24592)
</style>
