import VueRouter, { Route } from 'vue-router'
import Vue from 'vue'
import store from '../store'

type Context = {
  from: Route,
  to: Route,
  router: VueRouter,
  next: (to?: string | false | void | Location | ((vm: Vue) => any) | undefined) => void
}

export function checkLoginAuth (context: Context) {
  const { router, next } = context
  if (!store.state.user.name) {
    return router.push({ name: 'login' })
  } else if (!store.state.course) {
    return router.push({ name: 'course' })
  }
  return next()
}

export function checkCourseAuth (context: Context) {
  const { router, next } = context
  if (!store.state.user.name) {
    return router.push({ name: 'login' })
  }
  return next()
}
export function checkAdmin (context: Context) {
  const { router, next } = context
  if (!store.state.user.name || !store.state.user.admin) {
    return router.push({ name: 'adminLogin' })
  }
  return next()
}
