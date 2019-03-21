<template>
    <i :class="`mdi mdi-${name}`"
      :style="color"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false">
    </i>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BotResponse, Theme } from './types'

@Component
export default class ThemedIcon extends Vue {
  @Prop() name!: string
  hovered: Boolean = false

  get color () {
    if (!this.hovered) {
      return {}
    }
    const col = this.$store.state.theme.primary
    // CONVERT COL TO RGB
    const r = parseInt(col.substr(1, 2), 16)
    const g = parseInt(col.substr(3, 2), 16)
    const b = parseInt(col.substr(5, 2), 16)
    return {
      'color': this.$store.state.theme.primary,
      'background': `rgba(${r},${g},${b},0.1)`
    }
  }
}
</script>

<style scoped lang="sass">
i
  margin-left: 1rem
  padding-top: 0.5rem
  padding-bottom: 0.5rem
  padding-right: 0.5rem
  padding-left: 0.75rem
  font-size: 1.5rem
  color: #777
  border-radius: 50%
  cursor: pointer
</style>
