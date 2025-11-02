<script lang="ts" setup>
import {getServices, Service} from "@/ServicesService.ts";

  let services: Service[] = getServices()
</script>

<template>
  <h1>ServiceList</h1>
  <ul>
    <template v-for="service in services">
      <li><router-link :to="'services/'+service.id">{{ service.title }}</router-link></li>
    </template>
  </ul>
</template>

<style scoped>

</style>