<template>
    <i :class="`mdi mdi-${name}`"
      :style="color"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
      @click="$emit('click')">
    </i>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BotResponse, Theme } from './types'

@Component
export default class ThemedIcon extends Vue {
  @Prop() name!: string
  @Prop() margin!: string
  @Prop() padding!: string
  hovered: Boolean = false

  get color () {
    if (!this.hovered) {
      return {
        'margin': this.margin,
        'padding': this.padding
      }
    }
    const col = this.$store.state.theme.primary
    // CONVERT COL TO RGB
    const r = parseInt(col.substr(1, 2), 16)
    const g = parseInt(col.substr(3, 2), 16)
    const b = parseInt(col.substr(5, 2), 16)
    return {
      'color': this.$store.state.theme.primary,
      'background': `rgba(${r},${g},${b},0.1)`,
      'margin': this.margin,
      'padding': this.padding
    }
  }
}
</script>

<style scoped lang="sass">
i
  font-size: 1.5rem
  color: #777
  border-radius: 50%
  cursor: pointer
</style>
