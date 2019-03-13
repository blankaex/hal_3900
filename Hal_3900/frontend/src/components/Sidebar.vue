<template>
<div class="sidebar">

</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Sidebar extends Vue {
}
</script>

<style scoped lang="sass">
.sidebar
  border-top-left-radius: 10px
  border-bottom-left-radius: 10px
  height: 100vh
  width: 50%
  background: white
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)
</style>
