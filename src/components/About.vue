<template>
  <section>
    <div class="content">
      <cover></cover>
      <p>Hey, I’m a full stack developer from São Paulo, Brazil. I use web technologies to make applications. A new website is coming up ;)</p>
    </div>
  </section>
</template>

<script>

import Cover from './about/Cover.vue'
export default {
  name: 'about',
  components: { Cover }
}
</script>

<style scoped>
.content {
  max-width: 800px;
  margin: 0 auto;
}

p {
  font-size: 16px;
  line-height: 26px;
}
</style>
