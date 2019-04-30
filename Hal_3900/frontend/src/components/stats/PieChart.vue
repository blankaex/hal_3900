<template>
  <div>
    <canvas id="pie-chart"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Bar, mixins } from 'vue-chartjs'

interface Dataset {
  label: string,
    backgroundColor: string[],
    data: number[]
}

interface PieData {
  labels: string[],
    datasets: Dataset[]
}

@Component
export default class PieChart extends Bar {
  pieData: PieData={
    labels: ['quiz', 'query', 'missed'],
    datasets: [
      { label: 'Student Interactions',
        backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
        data: [1, 1, 1]
      }
    ]
  }

  mounted () {
    this.renderChart(this.pieData)
  }
}
</script>

<style scoped>

</style>
