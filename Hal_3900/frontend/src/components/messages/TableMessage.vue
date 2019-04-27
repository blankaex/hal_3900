<template>
  <div class="halMsg">
    <img src="../../assets/hal.png">
    <div class="table-container" :style="{'background': getGradient()}">
      <table class="table">
        <tr class="header">
          <td v-for="(item,i) in table[0]" :key="msg.id+'-table-0-'+i">{{item}}</td>
        </tr>
        <tr v-for="(row,r) in table.splice(1)" :key="msg.id+'-table-'+r">
          <td v-for="(item,i) in row" :key="msg.id+'-table-'+r+'-'+i">{{item}}</td>
        </tr>
      </table>
    </div>
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
.table-container
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
.table
  min-width: 200px
  border-collapse: collapse
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
.halMsg .text::before
  content: "Hal"
  margin-top: -1.4rem
  position: absolute
  font-size: 0.8rem
  color: #BBB
.table tr
  width: 200px
  font-family: 'Raleway', sans-serif
.table tr.header
  border-bottom: 1px solid #EBEBEB
.table tr.header td
  padding-bottom: 0.5rem
tr:nth-of-type(2) td
  padding-top: 0.5rem
</style>
