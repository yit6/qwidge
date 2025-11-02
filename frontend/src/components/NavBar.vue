<script setup lang="ts">
  import SearchBar from './SearchBar.vue';
</script>

<template>
  <nav id="navbar">
    <router-link id="brand" to="/">
      <img src="../assets/qwidge.png" width="80" height="80" alt="">
    </router-link>
    <div id="search">
      <SearchBar/>
    </div>
    <div id="route-links">
      <router-link to="/services"><p>Services</p></router-link>
    </div>
  </nav>
</template>

<style scoped>
#navbar {
    display: flex;
    width: auto;
    background-color: #E6E7E9;
    gap: 2%;
    padding: 10px 20px;
    position: sticky;
    top: 0;
    z-index: 100;
}

#brand {
  width: 20%;
  display: flex;
  font-weight: bold;
  color: var(--text-primary);
  text-decoration: none;
}

#search {
  width: 60%;
  display: flex;
}

#route-links {
  width: 20%;
  display: flex;
  justify-content: right;
  margin: auto;
}

#route-links p {
  margin: auto 0;
  font-size: large;
}

input {
  font-size: large;
}
</style>