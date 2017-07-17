import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

Vue.use(VueRouter, VueResource)

// import FontAwesome from 'font-awesome'
// import 'font-awesome/css/font-awesome.css' 

import App from './views/App.vue'
import Home from './views/Home.vue'
import About from './views/About.vue'


// Vue.use(FontAwesome)

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
