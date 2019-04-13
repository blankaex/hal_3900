import VueRouter, { Route } from 'vue-router'
import Vue from 'vue'
import store from '../store'

type Context = {
  from: Route,
  to: Route,
  router: VueRouter,
  next: (to?: string | false | void | Location | ((vm: Vue) => any) | undefined) => void
}

function parseCookies (cookie: string) {
  const cookies = new Map<string, string>()
  cookie.split('; ')
    .map(x => x.split('='))
    .map((v: string[]) => cookies.set(v[0], v[1]))
  return cookies
}

function isAuthedWithCookie () {
  const session = parseCookies(document.cookie).get('session')
  return session
}

function isAuthedSimple () {
  return store.state.user
}

export default function checkAuth (context: Context) {
  console.log('checking Auth')
  const { router, next } = context
  if (!isAuthedSimple()) {
    return router.push({ name: 'login' })
  }
  return next()
}
