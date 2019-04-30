<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Pie } from 'vue-chartjs'

interface Dataset {
  label: string,
    backgroundColor: string[],
    data: number[]
}

interface PieData {
  labels: string[],
  datasets: Dataset[]
}

@Component({
  extends: Pie,
})
export default class PieChart extends Vue<Pie> {
  @Prop() pieNums: number[]
  pieData: PieData={
    labels: ['quiz', 'query', 'unanswered'],
    datasets: [
      { label: 'Student Interactions',
        backgroundColor: ['#4363d8', '#911eb4', '#f032e6'],
        data: [1, 1, 1]
      }
    ]
  }

  mounted () {
    this.pieData.datasets[0].data = this.pieNums
    this.renderChart(this.pieData)
  }
}
</script>

<style scoped>

</style>
