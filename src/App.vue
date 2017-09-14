<template>
  <div class="app" :class="{'menu-open': this.menuOpened}">
    <app-header :menuOpened="menuOpened" @toogleMenu="toogleMenu"></app-header>
    <app-menu @toogleMenu="toogleMenu"></app-menu>
    <router-view></router-view>
    <app-footer></app-footer>
  </div>
</template>

<script>
import AppHeader from './components/shared/AppHeader.vue'
import AppMenu from './components/shared/AppMenu.vue'
import AppFooter from './components/shared/AppFooter.vue'
export default {
  name: 'app',
  components: { AppHeader, AppMenu, AppFooter },
  data() {
    return { menuOpened: false }
  },
  methods: {
    toogleMenu() {
      this.menuOpened = !this.menuOpened
    }
  }
}
</script>

<style scoped>
.app {
  transition: right, 0.25s;
  height: 100%;
  width: 100%;
  z-index: 0;
  right: 0;
  position: relative;
  padding: 0 20px;
  box-sizing: border-box;
}

.app.menu-open {
  right: 250px;
}
</style>