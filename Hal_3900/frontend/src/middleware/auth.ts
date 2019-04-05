import VueRouter, { Route } from 'vue-router'
import Vue from 'vue'

type Context = {
  from: Route,
  to: Route,
  router: VueRouter,
  next: (to?: string | false | void | Location | ((vm: Vue) => any) | undefined) => void
}

function parseCookies(cookie:string) {
  const cookies = new Map<string,string>();
  cookie.split("; ")
    .map(x=>x.split("="))
    .map((v:string[])=>cookies.set(v[0],v[1]))
  return cookies;
}

export default function checkAuth(context:Context) {
    const {router, next} = context
    const session = parseCookies(document.cookie).get('session')
    if (session === undefined) {
      return router.push({ name: 'login' })
    }
    return next()
}
