<template>
<div :class="{'sidebar':true,'open': open}">
  <div class="menu">
    <div class="actions">
      <ThemedIcon
      @click="open = !open"
      padding="0.45rem 0.5rem 0.35rem 0.5rem"
      name="menu"></ThemedIcon>
      <ThemedIcon
      @click="logout()"
      padding="0.45rem 0.5rem 0.35rem 0.5rem"
      name="logout-variant"></ThemedIcon>
    </div>
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
    <Log></Log>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Theme } from './types'
import ThemedIcon from './utility/ThemedIcon.vue'
import Log from './utility/Log.vue'

@Component({
  components: {
    ThemedIcon,
    Log
  }
})
export default class Sidebar extends Vue {
  open:boolean = false
  logout () {
    localStorage.removeItem('user')
    localStorage.removeItem('course')
    this.$store.commit('logout')
    this.$store.commit('wipe')
    this.$router.push({ name: 'login' })
  }
}
</script>

<style scoped lang="sass">
.sidebar
  @extend %flex-row
  position: default
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

@media only screen and (max-width: 849px)
  .sidebar
    position: absolute
    width: 90vw
    height: 100vh
    margin-right: 0px
    top: 0
    bottom: 0
    right: calc(-90vw + 50px)
  .sidebar.open
    right: 0
@media only screen and (min-width: 850px) and (max-width: 1000px)
  .sidebar
    position: default
    width: 100%
    margin-right: calc(-100% + 100px)
  .sidebar.open
    margin-right: 0%
.menu
  display: flex
  justify-content: space-between
  align-items: center
  flex-direction: column
  height: 100%
  width: 50px
.actions
  display: flex
  flex-direction: column
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
