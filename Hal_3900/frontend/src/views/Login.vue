<template>
  <div class='login'>
    <div class='card'>
      <h1 class='brand'>Hal 3900</h1>
      <hr>
      <small>Now with less murder!</small>
      <div class='features'>
        <div class='item'>
          <i class='mdi mdi-clock-outline'></i>
          <span>Get answers quickly</span>
        </div>
        <div class='item'>
          <i class='mdi mdi-forum'></i>
          <span>Have a interactive chat</span>
        </div>
        <div class='item'>
          <i class='mdi mdi-card-bulleted-outline'></i>
          <span>Get quizzed on hard topics</span>
        </div>
      </div>
      <form @submit.prevent='login()'>
        <input type='text' name='username' v-model.trim='username' placeholder='zid or name'/>
        <button type='submit'>Get Started</button>
      </form>
      <p> Looking for the admin page? <router-link to="admin">click here</router-link> </p>
    </div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Login extends Vue {
  username: string = ''
  invalidUsername: boolean = false

  login () {
    if (!this.username) { return }

    const host = this.$store.state.host
    const payload = { body: { zid: this.username } }
    const options = { credentials: true }
    fetch(`http://${host}/api/users/set`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        zid: this.username
      })
    }).then(r => r.json())
      .then(r => {
        this.$store.commit('login', {
          name: this.username,
          admin: false
        })
        this.$router.push({ name: 'course' })
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
  height: 500px
  background: white
  border-radius: 10px
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)
  display: flex
  flex-direction: column
  text-align: center
@media only screen and (max-width: 450px)
  .card
    width: 100vw
    height: 100vh
    box-shadow: none
    justify-content: center
.card p
  margin-top: 2rem
  font-family: 'Raleway', sans-serif
  color: #777
.card p a
  color: #F15F79
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
.card .brand
  font-family: 'Raleway', sans-serif
  margin-bottom: 0.5rem
.card form input
  border: 2px solid #EBEBEB
  outline: none
  border-radius: 15px
  padding: 0.3rem 0.7rem
  color: #444
  font-size: 0.8rem
  width: 12rem
.card form input:focus
  outline: none
.card form button
  outline: none
  border: none
  border-radius: 15px
  padding: 0.3rem 0.5rem
  background: linear-gradient(to right, #F15F79, #B24592)
  color: white
  cursor: pointer
  transition: all 0.3s cubic-bezier(.25,.8,.25,1)
.card form button:hover
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)
.card form button:focus
  outline: none
.card form
  margin-top: 1rem
  width: 80%
  margin-left: 10%
  margin-right: 10%
  display: flex
  justify-content: space-around
.features
  @extend %flex-col
  width: 80%
  margin-left: 10%
  margin-right: 10%
  margin-top: 2rem
  margin-bottom: 2rem
.item
  @extend %flex-row
  width: 90%
  marin-left: 5%
  marin-right: 5%
  justify-content: flex-start
  height: 2rem
  margin: 1rem 0rem
.item i
  font-size: 1.8rem
  color: #BBB
  margin-right: 2rem
.item span
  font-family: 'Raleway', sans-serif
  color: #777
  font-size: 1rem
  text-align: left
</style>
