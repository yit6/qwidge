<script setup>

</script>

<template>
  <!-- <p>Footer</p>
  <ul>
    <li>link</li>
    <li>link</li>
    <li>link</li>
    <li>link</li>
  </ul> -->
  <div id="footer">
    <h1>Qwidge</h1>
      <div id="footer-grid">
          <ul class="link-bar">
          <li><router-link to="/">link</router-link></li>
          <li><router-link to="/">link</router-link></li>
          <li><router-link to="/">link</router-link></li>
          <li><router-link to="/">link</router-link></li>
        </ul>
      <ul class="link-bar">
          <li><router-link to="/">link</router-link></li>
          <li><router-link to="/">link</router-link></li>
          <li><router-link to="/">link</router-link></li>
          <li><router-link to="/">link</router-link></li>
        </ul>
        <ul class="link-bar">
          <li><router-link to="/">link</router-link></li>
          <li><router-link to="/">link</router-link></li>
          <li><router-link to="/">link</router-link></li>
          <li><router-link to="/">link</router-link></li>
        </ul>
      </div>
      <p>Copyright Qwidge 2025</p>
  </div>
</template>

<style scoped>
a {
  color: white;
}

li {
  margin: 10px 0;
}

#footer {
  background-color: black;
  color: white;
  padding: 20px 20%;
  text-align: center;
}

#footer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.link-bar {
  list-style-type: none;
}
</style>