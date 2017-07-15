import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './views/App.vue'
import Home from './views/Home.vue'
import About from './views/About.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/about' },
  { path: '/home', component: Home },
  { path: '/about', component: About }
]
const router = new VueRouter({ routes, mode: 'history' })
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
