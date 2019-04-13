<template>
<div class="chat">
  <div class="messages" id="messages">
    <Message
      v-for="message in $store.state.messages"
      :key="message.id"
      :message="message">
    </Message>
    <LoadingAnim v-if="loading()"></LoadingAnim>
  </div>
  <div class="input" v-on:keydown.enter="send" >
    <input type="text"
      v-model="draft"
      :style="inputColor"
      @focus="inputFocused = true"
      @blur="inputFocused = false"
    />
    <ThemedIcon
      name="send"
      padding="0.5rem 0.5rem 0.5rem 0.75rem"
      margin="0rem 0rem 0rem 1rem"
      @click="send"></ThemedIcon>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BotResponse, Theme, AppState } from './types'
import ThemedIcon from './ThemedIcon.vue'
import Message from './Message.vue'
import LoadingAnim from './LoadingAnim.vue'

@Component({
  components: {
    ThemedIcon,
    Message,
    LoadingAnim
  }
})
export default class Chat extends Vue {
  draft: string = ''
  inputFocused: Boolean = false

  get inputColor () {
    if (!this.inputFocused) {
      return {}
    }
    return {
      'borderColor': this.$store.state.theme.primary,
      'color': this.$store.state.theme.primary
    }
  }

  scrollEnd () {
    const container = this.$el.querySelector('#messages')
    if (container === null) return
    container.scrollTop = container.scrollHeight
  }

  send () {
    if (this.draft.trim() === '') return
    this.$store.dispatch('sendMessage', this.draft)
    this.draft = ''
    this.$nextTick(function () {
      this.scrollEnd()
    })
  }

  loading () {
    return this.$store.state.status === AppState.PENDING
  }
}
</script>

<style scoped lang="sass">
.chat
  @extend %flex-col
  margin-top: 2rem
  height: calc(100vh - 2rem)
  width: calc(100% - 2rem)
  margin-left: 1rem
  margin-right: 1rem
.messages
  width: 100%
  max-height: 100%
  overflow-y: scroll
  height: calc(100% - 5rem)
.input
  @extend %flex-center
  width: 100%
  height: 5rem
.input input
  height: 2rem
  border: 2px solid #EBEBEB
  background: none
  width: 90%
  border-radius: 15px
  padding-left: 1rem
  padding-right: 1rem
  color: #BBB
  font-size: 1rem
.input input:focus
  outline: none
  border-color: #fd746c
  color: #fd746c
</style>
