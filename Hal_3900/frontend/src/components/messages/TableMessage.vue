<template>
  <div class="halMsg">
    <img src="../../assets/hal.png">
    <table class="table" :style="{'background': getGradient()}">
      <th>
        <td v-for="(item,i) in table[0]" :key="msg.id+'-table-0-'+i">{{item}}</td>
      </th>
      <tr v-for="(row,r) in table.splice(1)" :key="msg.id+'-table-'+r">
        <td v-for="(item,i) in row" :key="msg.id+'-table-'+r+'-'+i">{{item}}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BotResponse, Theme, Message } from './../types'

@Component
export default class TableMessage extends Vue {
  @Prop() msg!:Message
  @Prop() table:any

  getGradient () {
    const theme:Theme = this.$store.state.theme
    const sg = theme.secondaryGradient
    return `linear-gradient(to right, ${sg[0]}, ${sg[1]})`
  }
}
</script>

<style scoped lang="sass">
.table
  padding: 0.5rem 1rem
  position: relative
  font-family: 'Raleway', sans-serif
  border-radius: 10px
  color: white
  max-width: 60%
  white-space: pre-wrap
  white-space: -moz-pre-wrap
  white-space: -pre-wrap
  white-space: -o-pre-wrap
  word-wrap: break-word
.halMsg
  @extend %flex-row
  width: 100%
  margin-bottom: 0.5rem
  justify-content: flex-start
.halMsg img
  width: 48px
  height: 48px
  border-radius: 50%
  margin: 0.5rem
.table
  width: 100%
.table tr, .table th
  width: 100%
.item
  font-family: 'Raleway', sans-serif
</style>
