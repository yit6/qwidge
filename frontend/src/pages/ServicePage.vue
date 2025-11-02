<script setup lang="ts">
  import {useRoute} from "vue-router";
  import {getService} from "@/ServicesService.ts";

  let id = useRoute().params.id;
  let service = getService(id);
</script>

<template>
  <template v-if="service">
    <h1>{{ service.title }}</h1>
    <img :src="service.imageUrl" alt="">
    <p>{{ service.description }}</p>
    <p>Rating: {{service.rating}}</p>
    <p>Sources: {{service.sources}}</p>
  </template>
  <template v-else>
    <p>not found</p>
  </template>
</template>

<style scoped>

</style>