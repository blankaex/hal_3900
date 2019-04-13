<template>
  <div class="halMsg">
    <img src="../../assets/hal.png">
    <div class="spinner">
      <div class="double-bounce1"
        :style="{'background-color': this.$store.state.theme.secondary}"></div>
      <div
      class="double-bounce2"
      :style="{'background-color': this.$store.state.theme.secondary}"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class LoadingAnim extends Vue {

}
</script>

<style scoped lang="sass">
//TODO: attribute this css to the site i stole it from ;)
.spinner
  width: 40px
  height: 40px
  position: relative

.double-bounce1, .double-bounce2
  width: 100%
  height: 100%
  border-radius: 50%
  opacity: 0.6
  position: absolute
  top: 0
  left: 0
  -webkit-animation: sk-bounce 2.0s infinite ease-in-out
  animation: sk-bounce 2.0s infinite ease-in-out

.double-bounce2
  -webkit-animation-delay: -1.0s
  animation-delay: -1.0s
@-webkit-keyframes sk-bounce
  0%, 100%
    -webkit-transform: scale(0.0)
  50%
    -webkit-transform: scale(1.0)

@keyframes sk-bounce
  0%, 100%
    transform: scale(0.0)
    -webkit-transform: scale(0.0)
  50%
    transform: scale(1.0)
    -webkit-transform: scale(1.0)

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
