<template>
  <div class="message">
    <HalMessage v-if="message.type === 'simple' && message.from === 'bot'" :message="message"></HalMessage>
    <UserMessage v-if="message.type === 'simple' && message.from === 'user'" :message="message"></UserMessage>
    <OptionsMessage v-if="message.type === 'options'" :options="message.body"></OptionsMessage>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BotResponse, Theme } from './types'
import HalMessage from './HalMessage.vue'
import UserMessage from './UserMessage.vue'
import OptionsMessage from './OptionsMessage.vue'

@Component({
  components: {
    HalMessage,
    UserMessage,
    OptionsMessage
  }
})
export default class Message extends Vue {
   @Prop() message: any
}
</script>

<style scoped lang="sass">
.message
  width: 100%
  margin-bottom: 0.5rem
</style>
