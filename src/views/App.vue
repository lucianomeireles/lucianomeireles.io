<template>
  <div class="app" :class="{'menu-open': this.menuOpened}">
    <app-header :menuOpened="menuOpened" @toogleMenu="toogleMenu"></app-header>
    <app-menu v-if="menuOpened" @toogleMenu="toogleMenu"></app-menu>
    <router-view></router-view>
  </div>
</template>

<script>
import AppHeader from './shared/AppHeader.vue'
import AppMenu from './shared/AppMenu.vue'
export default {
  name: 'App',
  components: {AppHeader, AppMenu},
  data(){
    return{
      menuOpened: false
    }
  },
  methods:{
    toogleMenu(){
      this.menuOpened = !this.menuOpened
    }
  }
}
</script>

<style scoped>
  .app{
    transition: right, 0.25s;
    height: 100%;
    width: 100%;
    z-index: 0;
    right: 0;
    position: relative;
  }
  .app.menu-open{
    right: 250px;
  }
</style>
