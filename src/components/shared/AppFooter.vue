<template>
  <footer>
    <hr>
    <ul>
      <li><a href="mailto:contato@lucianomeireles.io"><i class="glyphicons glyphicons-glass"></i> Email</a></li>
      <li><a href="https://www.linkedin.com/in/lucianomeireles/" target="blank">LinkedIn</a></li>
      <li><a href="https://github.com/lucianomeireles" target="blank">Github</a></li>
    </ul>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
  footer{
    max-width: 800px;
    margin: 0 auto;
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