import Vue from 'vue'
import Router from 'vue-router'
import {auth} from '../firebase'
import Acceuil from '@/components/Acceuil'
import Login from '@/components/Login'
import Inscription from '@/components/Inscription'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/inscription',
      name: 'Inscription',
      component: Inscription
    },
    {
      path: '/acceuil',
      name: 'Acceuil',
      component: Acceuil,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  var userActuel = auth.currentUser
  var requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !userActuel) next('login')
  else if (!requiresAuth && userActuel) next('acceuil')
  else next()
})

export default router
