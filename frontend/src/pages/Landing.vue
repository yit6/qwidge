<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue';
import Trending from '@/components/Trending.vue'

</script>

<template>
  <img src="https://www.busytourist.com/wp-content/uploads/2020/11/Things-To-Do-In-Rochester-NY.jpg"/>
  <div>
    <p>I want to...</p>
    <div style="width: 50%;">
      <SearchBar/>
    </div>
  </div>
  <trending/>
  <div>
    <p>Have something to offer?</p>
    <form action="http://localhost:8080/search" method="post">
    <input type="text" name="url">
    <input type="submit">Submit Services</input>
    </form>
  </div>
</template>

<style scoped>

</style>
