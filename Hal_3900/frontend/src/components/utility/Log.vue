<template>
    <div class="log">
      <div class="logline" v-for="logItem in $store.state.log" :key="logItem.id">
        <span>{{logItem.timestamp.calendar()}}</span><br>
        {{logItem.message}}
      </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Log extends Vue {

}
</script>

<style scoped lang="sass">
.log
  width: calc(100% - 2rem)
  height: calc(40% - 1rem)
  overflow-y: scroll
  margin-top: 1rem
  margin-left: 1rem
  margin-right: 1rem
  border: 1px solid #EBEBEB
  border-radius: 10px
.log .logline
  width: calc(100% - 2rem)
  padding-left: 1rem
  padding-right: 1rem
  padding-top: 0.5rem
  padding-bottom: 0.5rem
  font-family: 'Raleway', sans-serif
  color: #444
  border-bottom: 1px solid #EBEBEB
.log .logline span
  font-family: 'Raleway', sans-serif
  color: #777
  margin-right: 1rem
  width: 100%
  font-size: 0.7rem
</style>
