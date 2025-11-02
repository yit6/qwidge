<script setup>
  
</script>

<template>
  <nav id="navbar">
    <!-- <div style="display: flex;">
      
    </div>
    <ul style="display: flex; gap:20px;">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/services">Services</router-link></li>
    </ul> -->
    <router-link id="brand" to="/">
      <img src="../assets/logo.svg" width="32" height="32" alt="">
      <h2 style="margin: auto 10px;">Qwidge</h2>
    </router-link>
    <div id="search">
      <div id="search-logo">
        <img src="../assets/logo.svg" width="32" height="32" alt="">
      </div>
      <input/>
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
    background-color: var(--bg-primary);
    gap: 2%;
    padding: 10px 20px;
    margin-bottom: 4px;
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

#search input {
  width: 90%;
  border: 0;
  border-radius: 0 10px 10px 0;
}

#search-logo {
  background-color: white;
  border-radius: 10px 0 0 10px;
  height: 100%;
  display: flex;
}

#search-logo img {
  width: 20px;
  height: 20px;
  margin: auto 10px;
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