<template>
  <figure>
    <img width="800" height="300" src="/src/assets/ibirapuera.jpg" alt="Parque Ibirapuera">
    <figcaption>
      Ibirapuera Park, São Paulo
    </figcaption>
  </figure>
</template>

<script>
export default {
  name: 'cover'
}
</script>

<style scoped>
  figure{
    margin: 0 0 50px;
  }  
  img{
    display: block;
    margin: 0;
  }
  figcaption{
    font-size: 12px;
    color: #878787;
    margin-top: 10px;
  }
</style>
