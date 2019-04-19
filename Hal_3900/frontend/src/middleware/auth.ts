import VueRouter, { Route } from 'vue-router'
import Vue from 'vue'
import store from '../store'

type Context = {
  from: Route,
  to: Route,
  router: VueRouter,
  next: (to?: string | false | void | Location | ((vm: Vue) => any) | undefined) => void
}

export default function checkAuth (context: Context) {
  const { router, next } = context
  if (!store.state.user) {
    return router.push({ name: 'login' })
  } else if (!store.state.course) {
    return router.push({ name: 'course' })
  }
  return next()
}
