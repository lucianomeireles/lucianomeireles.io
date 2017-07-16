<template>
  <div>
    <header>
      <div class="logo-container">
        <div class="logo-img">
          <img src="/src/assets/Portrait.jpg" alt="Luciano Meireles Portrait">
        </div>
        <div class="logo-title">
          <h1>Luciano Meireles</h1>
          <h2>Software Developer</h2>
        </div>
      </div>
      <div class="menu-trigger">
        <button type="button" @click="toogleMenu">
          <img :src="menuIcon" alt="Open Menu">
        </button>
      </div>

    </header>
  </div>    
</template>

<script>
export default {
  name: 'appHeader',
  props:{
    menuOpened: Boolean
  },
  computed: {
    menuIcon(){
      return this.menuOpened ? '/src/assets/menu-close.svg' : 
                              '/src/assets/menu-icon.svg'
    }
  },
  methods:{
    toogleMenu(){
      this.$emit('toogleMenu')
    }
  }
}
</script>

<style scoped>
  header{
    display: flex;
    box-orient: horizontal;
    box-direction: normal;
    flex-direction: row;
    box-pack: justify;
    justify-content: space-between;
    box-align: center;
    padding: 20px;
    margin-bottom: 50px;
  }
  .logo-container{
    display: flex;
    box-orient: rows;
    box-direction: normal;
    box-align: center;
    align-items: center;
  }
  .logo-img{
    display: block;
    box-sizing: border-box;
  }
  .logo-img img{
    display: block;
    margin: 0;
    height: 75px;
    box-sizing: border-box;
    border-radius: 50%;
    transition: all 250ms ease;
  }
  img:hover{
    transform: rotate(360deg);
  }
  .logo-title{
    display: flex;
    box-orient: vertical;
    box-direction: normal;
    flex-direction: column;
  }
  .logo-title h1{
    margin: 0 0 3px 20px;
    padding: 0;
    font-size: 18px;
  }
  .logo-title h2{
    margin: 0 0 0 20px;
    padding: 0;
    font-weight: normal;
    font-size: 16px;
  }
  .menu-trigger{
    box-sizing: border-box;
    box-flex: 0;
    flex: 0 0 20%;
    display: flex;
    box-pack: end;
    justify-content: flex-end;
    box-align: center;
    align-items: center;
  }
  .menu-trigger button{
    box-sizing: border-box;
    border: 0;
    background: transparent;
    outline: 0;
    margin: 0;
    padding: 0;
    cursor: pointer;
    display: block;
    margin-right: 20px;
    outline: 0;
  }
  .menu-trigger button img{
    box-sizing: border-box !important;    
    display: block;
    height: 20px;
    margin: 0;
  }
</style>
