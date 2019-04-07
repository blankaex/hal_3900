<template>
<div :class="{'sidebar':true,'open': open}">
  <div class="menu">
    <ThemedIcon
    @click="open = !open"
    padding="0.45rem 0.5rem 0.35rem 0.5rem"
    name="menu"></ThemedIcon>
    <div class="themes">
      <div v-for="theme in $store.state.themes"
        :key="theme.primary"
        @click="$store.commit('changeTheme',theme.primary)"
        :class="{'color-option':true,'active':$store.state.theme.primary === theme.primary}"
        :style="{background: `linear-gradient(to right, ${theme.primaryGradient[0]}, ${theme.primaryGradient[1]})`}"
        >
      </div>
    </div>
  </div>
  <div class="content">
    <div class="log">
      <div class="logline" v-for="logItem in $store.state.log" :key="logItem.id">
        <span>{{logItem.timestamp.calendar()}}</span><br>
        {{logItem.message}}
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Theme } from './types'
import ThemedIcon from './ThemedIcon.vue'
import Log from './Log.vue'

@Component({
  components: {
    ThemedIcon,
    Log
  }
})
export default class Sidebar extends Vue {
  open:boolean = false
}
</script>

<style scoped lang="sass">
.sidebar
  @extend %flex-row
  justify-content: flex-start
  border-top-left-radius: 10px
  border-bottom-left-radius: 10px
  height: 100vh
  width: 50%
  margin-right: calc(-50% + 75px)
  background: white
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)
  transition: all 0.5s
.sidebar.open
  margin-right: 0%
.menu
  display: flex
  justify-content: space-between
  align-items: center
  flex-direction: column
  height: 100%
  width: 50px
.content
  display: flex
  flex-direction: column
  height: 100%
  width: calc(100% - 50px)
.menu i
  color: #777
  font-size: 1.5rem
  margin-top: .5rem
  cursor: pointer
.menu i:hover
  color: #fd746c
.color-option
  width: 24px
  height: 24px
  opacity: 0.5
  margin-top: .5rem
  margin-bottom: .5rem
  border-radius: 50%
  background: black
  cursor: pointer
.color-option.active
  opacity: 1
.color-option:hover
  opacity: 1
</style>
