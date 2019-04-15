import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Admin from './views/Admin.vue'
import checkAuth from './middleware/auth'
import CourseSelect from './views/CourseSelect.vue'

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
    },
    {
      path: '/course',
      name: 'course',
      component: CourseSelect
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

// set up middleware
// only allows 1 middleware elem for simplicity
router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = to.meta.middleware
    return middleware({ from, to, router, next })
  }
  return next()
})

export default router
