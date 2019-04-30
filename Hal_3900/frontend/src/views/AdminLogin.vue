<template>
  <div class='login'>
    <div :class="{'card': true, 'errored': error !== ''}">
      <h1 class='brand'>Hal 3900</h1>
      <hr>
      <small v-if="error === ''">Admin Login Page</small>
      <small class="error" v-if="error !== ''">{{error}}</small>
      <div class="fields">
        <input type='text' name='username' v-model.trim='username' placeholder='username'/>
        <input type='text' name='password' v-model.trim='password' placeholder='password'/>
      </div>
      <div class="actions">
        <button @click="register()" type='submit'>Register</button>
        <button @click="login()" type='submit'>Login</button>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Login extends Vue {
  username: string = ''
  password: string = ''
  error: string = ''

  register () {
    if (!this.password) {
      this.error = 'password must not be empty'
      return
    }
    this.error = ''
    if (!this.username || !this.password) {
      this.error = 'username/password must not be empty'
      return
    }

    const host = this.$store.state.host
    const options:RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        username: this.username,
        password: this.password
      })
    }
    fetch(`http://${host}/api/admin/register`, options)
      .then((r:Response) => {
        if (r.status !== 200) throw Error('Non 200 response')
        this.$store.commit('login', {
          name: this.username,
          admin: true
        })
        this.$router.push({ name: 'admin' })
      })
      .catch(() => {
        this.error = 'Username Taken'
      })
  }
  login () {
    if (!this.username || !this.password) {
      this.error = 'username/password must not be empty'
      return
    }
    this.error = ''

    const host = this.$store.state.host
    const options:RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        username: this.username,
        password: this.password
      })
    }
    fetch(`http://${host}/api/admin/login`, options)
      .then((r:Response) => {
        if (r.status !== 200) throw Error('Non 200 response')
        this.$store.commit('login', {
          name: this.username,
          admin: true
        })
        this.$router.push({ name: 'admin' })
      })
      .catch(() => {
        this.error = 'Username/Password Incorrect'
      })
  }
}
</script>

<style scoped lang='sass'>
.login
  width: 100vw
  height: 100vh
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  background: #FAFAFA
.card
  width: 400px
  height: 300px
  background: white
  border-radius: 10px
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)
  display: flex
  flex-direction: column
  text-align: center
  transition: all 0.3s
@media only screen and (max-width: 450px)
  .card
    width: 100vw
    height: 100vh
    box-shadow: none
    justify-content: center
.card.errored
  box-shadow: 0 10px 20px rgba(241, 95, 121, 0.4), 0 6px 6px rgba(241, 95, 121, 0.45)
.card hr
  width: 80%
  border: none
  outline: none
  height: 3px
  border-radius: 10px
  background: linear-gradient(to right, #F15F79, #B24592)
.card small
  font-family: 'Raleway', sans-serif
  color: #777
  margin-bottom: 2rem
.card small.error
  font-family: 'Raleway', sans-serif
  color: #F15F79
  margin-bottom: 2rem

.card .brand
  font-family: 'Raleway', sans-serif
  margin-bottom: 0.5rem
.card .fields
  @extend %flex-col
  width: 100%
.card .actions
  @extend %flex-row
  margin-top: 1rem
  width: 12rem
  margin-left: calc(50% - 6rem)
  margin-right: calc(50% - 6rem)
  justify-content: space-around
.card .fields input
  border: 2px solid #EBEBEB
  outline: none
  border-radius: 15px
  padding: 0.3rem 0.7rem
  color: #444
  font-size: 0.8rem
  margin-top: 0.5rem
  margin-bottom: 0.5rem
  width: 12rem
.card .fields input:focus
  outline: none
.card .actions button
  outline: none
  border: none
  border-radius: 15px
  padding: 0.3rem 0.5rem
  background: linear-gradient(to right, #F15F79, #B24592)
  color: white
  cursor: pointer
  transition: all 0.3s cubic-bezier(.25,.8,.25,1)
.card .actions button:hover
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)
.card .actions button:focus
  outline: none
</style>
