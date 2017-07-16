<template>
  <div class="app-menu">
    <nav>
      <ul>
        <li><a href="#" @click.prevent="openMenu('home')">Home</a></li>
        <li><a href="#" @click.prevent="openMenu('about')">About</a></li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'AppMenu',
  methods:{
    openMenu(path){
      this.$router.push({ path: path })
      this.$emit('toogleMenu')
    }
  }
}
</script>

<style scoped>
  .app-menu{
    box-sizing: border-box;
    transition: right, 0.25s;
    border-left: 2px solid #f2f2f2;
    position: fixed;
    top: 0px;
    right: -250px;
    height: 100%;
    width: 250px;
    background-color: white;
  }
  nav{
    padding: 25px 45px;
    box-sizing: border-box;
  }
  ul{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    overflow: hidden;
    margin-bottom: 3px;
    margin-top: 25px;
  }
  ul li{
    margin-bottom: 20px;
  }
  ul a{
    font-size: 22px;
    line-height: 22px;
    letter-spacing: 0;
    color: #373737;
    font-weight: 300;
    text-decoration: none;
  }
</style>
<style>
  .app.menu-open .app-menu{
    right: 0;
  }
</style>
