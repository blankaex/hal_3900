<template>
  <div class="login">
    <form>
      <h3>Login:</h3>
      <input type="text" name="username" v-model.trim="username" placeholder="zID"/>
      <!--    <input type="password" name="password" v-model.trim="password" placeholder="Password"/>-->
      <button type="button" v-on:click.prevent="login()">SIGN IN</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import router from "@/router";

// export default class Login extends Vue
export default class Login extends Vue {
  username: any;
  login () {
    if (this.username) {

      let host = 'backend.hal-3900.com'
      if (window.location.host !== 'hal-3900.com') {
        host = 'localhost:9447'
      }
      this.$http.post(`http://${host}/api/users/set`, { body: { zid: this.username } })
        .then(data => console.log(data))
      this.$router.push('/')
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
