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
      beforeEnter: (to, from, next) => {
        if (!auth.currentUser) {
          next('/login')
        } else {
          next()
        }
      }
    }
  ]
})

export default router
