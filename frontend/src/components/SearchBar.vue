<script setup>
  
</script>

<template>
    <div id="searchbar">
      <div id="searchbar-logo">
        <img src="../assets/ailogo.svg" width="32" height="32" alt="">
      </div>
      <input/>
    </div>
</template>

<style scoped>
#searchbar {
  width: 100%;
  height: max-content;
  display: flex;
  border: 3px solid black;
  border-radius: 12px;
  margin: auto;
}

#searchbar input {
  width: 100%;
  border: 0;
  border-radius: 0 10px 10px 0;
  font-size: medium;
}

#searchbar input:focus {
  outline: none;
}

#searchbar:has(input:focus) {
  filter: brightness(0.95);
}

#searchbar-logo {
  background-color: white;
  border-radius: 10px 0 0 10px;
  height: 100%;
  display: flex;
}

#searchbar-logo img {
  margin: auto 10px;
}
</style>