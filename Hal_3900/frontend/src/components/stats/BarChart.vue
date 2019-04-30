<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Bar } from 'vue-chartjs'

  interface Dataset {
    label: string,
    backgroundColor: string[],
    data: number[]
  }

  interface BarData {
    labels: string[],
    datasets: Dataset[]
  }

@Component({
  extends: Bar
})
export default class BarChart extends Vue {
  @Prop() tagCounts: any // tagcounts[i].count and .tag
  barData: BarData={
    labels: [],
    datasets: [
      { label: 'Keyword Counts',
        backgroundColor: ['#e6194B', '#f58231', '#ffe119', '#bfef45', '#3cb44b', '#42d4f4', '#4363d8', '#911eb4', '#f032e6', '#a9a9a9'],
        data: [1, 1, 1]
      }
    ]
  }
  options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
  mounted () {
    // sort results and take top 10
    this.tagCounts = this.tagCounts.sort((a:any, b:any) => {
      if (a.count < b.count) return 1
      if (a.count > b.count) return -1
      return 0
    })
    if (this.tagCounts.length > 10) {
      this.tagCounts = this.tagCounts.slice(0, 10)
    }
    // input to dataset
    this.barData.labels = this.tagCounts.map((item:any) => item.tag)
    this.barData.datasets[0].data = this.tagCounts.map((item:any) => item.count)
    this.barData.datasets[0].data.push(0)
    const me:any = this
    me.renderChart(this.barData, this.options)
  }
}
</script>

<style scoped>

</style>
