import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import checkAuth from './middleware/auth'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        middleware: checkAuth
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

// set up middleware
// only allows 1 middleware elem for simplicity
router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = to.meta.middleware
    return middleware({ from, to, router, next }) // TODO Error: middleware[0] is not a function
  }
  return next()
})

export default router
