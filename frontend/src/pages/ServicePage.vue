<script setup lang="ts">
  import {useRoute} from "vue-router";
  import {getService, Service} from "@/ServicesService.ts";
  import {Ref, ref} from "vue";

  let id: number = +useRoute().params.id!;
  let service: Ref<Service> = ref(null);
  let sourceList: Ref<Array<string>> = ref(null)
  getService(id).then((r: Service) => {
    service.value = r
    sourceList.value = JSON.parse(service.sources)
  });
</script>

<template>
  <router-link to="/services">Return</router-link>
  <template v-if="service">
    <h1>{{ service.title }}</h1>
    <h2>provided by: {{ service.organization }}</h2>
    <img :src="service.imageUrl" alt="">
    <p>{{ service.description }}</p>
    <p>Sources:</p>
    <ul>
      <li v-for="link in sourceList">{{ link }}</li>
    </ul>
  </template>
  <template v-else>
    <p>not found</p>
  </template>
</template>

<style scoped>

</style>
