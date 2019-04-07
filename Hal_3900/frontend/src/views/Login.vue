<template>
  <div class="login">
    <h3>Login:</h3>
    <input type="text" name="username" placeholder="Username"/>
    <input type="password" name="password" placeholder="Password"/>
    <button type="button">Login</button>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'

export default class Login extends Vue {}
</script>

<style scoped lang="sass">

</style>
