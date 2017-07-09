import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from './components/Home.vue'
import About from './components/About.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/about' },
  { path: '/about', component: About }
]
const router = new VueRouter({ routes, mode: 'history' })

new Vue({ router }).$mount('#app')