<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  mounted () {
    this.$store.dispatch('init')
  }
}
</script>

<style lang="sass">

</style>
