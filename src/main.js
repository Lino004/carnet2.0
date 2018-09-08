// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import {auth} from './firebase'
import Vue from 'vue'
import App from './App'
import router from './router'
import VueFire from 'vuefire'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueFire)

let app

auth.onAuthStateChanged(function (user) {

  store.dispatch('setUser', user)

  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      components: { App },
      template: '<App/>'
    })
  }
  
})
