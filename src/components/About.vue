<template>
  <section class="content">
    <cover></cover>
    <p>Hey, I’m a full stack developer from São Paulo, Brazil.
      I use web technologies to make applications. A new website is coming up ;)</p>
    <hr>
    <ul>
      <li><a href="mailto:contato@lucianomeireles.io">Email</a></li>
      <li><a href="https://www.linkedin.com/in/lucianomeireles/" target="blank">LinkedIn</a></li>
      <li><a href="https://github.com/lucianomeireles" target="blank">Github</a></li>
    </ul>
  </section>
</template>

<script>
import Cover from './About/Cover.vue'
export default {
  name: 'about',
  components: {Cover}
}
</script>

<style scoped>
  .content{
    width: 800px;
    max-width: 800px;
    margin: 0 auto;
  }  
  p{
    font-size: 16px;
    line-height: 26px;
  }
  hr{
    background: #e7ebee;
    border: 0;
    color: #e7ebee;
    display: block;
    font-size: 0;
    height: .3rem;
    margin: 40px 0;
    width: 100%;
  }
  ul{
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
  }
  ul li {
    flex: 0 0 33.33%;
    font-size: 14px;
    list-style: none;
    padding: 0;
    text-align: center;
  }
  ul li a{
    color: dimgrey;
    text-decoration: none;
    transition: color 200ms ease;
  }
  ul li a:hover{
    color: black;
  }
</style>
