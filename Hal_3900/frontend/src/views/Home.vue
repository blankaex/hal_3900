<template>
  <div class="home">
    <Chat/>
    <Sidebar/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Chat from '@/components/Chat.vue'
import Sidebar from '@/components/Sidebar.vue'

@Component({
  components: {
    Chat,
    Sidebar
  }
})

export default class Home extends Vue {}
</script>

<style scoped lang="sass">
.home
  @extend %flex-row
  background: #FAFAFA
  width: 100vw
  overflow-x: hidden
</style>
