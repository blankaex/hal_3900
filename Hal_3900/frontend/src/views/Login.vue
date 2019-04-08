<template>
  <div class="login">
    <h3>Login:</h3>
    <input type="text" name="username" v-model.trim="username" placeholder="Username"/>
    <input type="password" name="password" v-model.trim="password" placeholder="Password"/>
    <button type="button" v-on:click="login()">Login</button>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'

// export default class Login extends Vue
export default class Login extends Vue {
  username: any;
  password: any;
  login () {
    if (this.username && this.password) {
      console.log(this.username)
      console.log('awkward plaintext password')
      // TODO needs to send credentials to backend, and receive cookie back
    }
  }
}
</script>

<style scoped lang="sass">
.login
  width: 100%
  height: 100%
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  margin-top: auto
  color: #FFFFFF
  background-color: #5C5C5C

</style>
