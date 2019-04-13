<template>
  <div class="login">
    <form>
      <h3>Login:</h3>
      <input type="text" name="username" v-model.trim="username" placeholder="zID"/>
      <!--    <input type="password" name="password" v-model.trim="password" placeholder="Password"/>-->
      <button type="submit" v-on:click.prevent="login()">SIGN IN</button>
    </form>
<!--    <div v-if="submitted">login failed</div>-->
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'

// export default class Login extends Vue
export default class Login extends Vue {
  username: any;
  login () {
    if (this.username) {
      // get URL for backend API
      let host = 'backend.hal-3900.com'
      if (window.location.host !== 'hal-3900.com') {
        host = 'localhost:9447'
      }
      // post login credentials to backend
      this.$http.post(`http://${host}/api/users/set`, { body: { zid: this.username } })
        .then(res => {
          console.log(res)
          if (res.ok) {
            // if backend response ok, set authed in store
            this.$store.commit('login', this.username)
            this.$router.push({ name: 'home' })
          }
        })
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
