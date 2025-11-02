<script setup lang="ts">
import ServiceItem from "@/components/ServiceItem.vue";
import {getServices, Service} from "@/ServicesService.ts";

  let services: Service[] = getServices()
</script>

<template>
  <h1>ServiceList</h1>
  <ul>
    <template v-for="service in services">
      <li><ServiceItem/></li>
    </template>
  </ul>
</template>

<style scoped>

</style>