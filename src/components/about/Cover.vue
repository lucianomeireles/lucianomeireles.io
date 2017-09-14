<template>
  <figure>
    <img src="/static/ibirapuera.jpg" alt="Parque Ibirapuera">
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
    max-height: 300px;
    width: 100%;
  }
  figcaption{
    font-size: 12px;
    color: #878787;
    margin-top: 10px;
  }
</style>
