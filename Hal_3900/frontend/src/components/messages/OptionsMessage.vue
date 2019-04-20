<template>
  <div class="halMsg">
    <img src="../../assets/hal.png">
    <div class="options" :style="{'background': getGradient()}">
        <div :class="{'item': true, 'dead': isActive()}" v-for="(option,i) in message.body" :key="option._id">
          <div class="selectBest" @click="selectBest(option,i)"></div>{{option.text.trim()}}</div>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BotResponse, Theme } from './../types'

@Component
export default class OptionsMessage extends Vue {
  @Prop() message:any

  selectBest (choice:any, choiceIndex:number) {
    if (this.$store.state.activeMessage !== this.message.id) return

    this.$store.dispatch('sendTraining', choice)
    this.$store.commit('storeMessage', {
      type: 'simple',
      from: 'user',
      body: choiceIndex
    })
    this.$store.commit('storeMessage', {
      type: 'simple',
      from: 'bot',
      body: 'Thanks!'
    })
  }
  isActive () {
    return this.$store.state.activeMessage !== this.message.id
  }
  getGradient () {
    const theme:Theme = this.$store.state.theme
    const sg = theme.secondaryGradient
    return `linear-gradient(to right, ${sg[0]}, ${sg[1]})`
  }
}
</script>

<style scoped lang="sass">
.options
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
.options .item
  display: flex
  align-items: center
  justify-content: flex-start
  flex-direction: row
  height: 2rem
.options .item.dead
  opacity: 0.4
.options .item.picked
  opacity: 1
.options .item .selectBest
  width: 15px
  height: 15px
  border: 2px solid #EBEBEB
  border-radius: 50%
  margin-right: 1rem
  cursor: pointer
.options .item.dead .selectBest, .options .item.picked .selectBest
  cursor: default
.options .item.picked .selectBest
  background: #EBEBEB

.options .item .selectBest:hover
  background: #EBEBEB
.options .item.dead .selectBest:hover, .options .item.picked .selectBest:hover
  background: none

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
</style>
