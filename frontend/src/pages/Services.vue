<script setup lang="ts">
import ServiceItem from "@/components/ServiceItem.vue";
import {getServices, Service} from "@/ServicesService.ts";

  let services: Service[] = getServices()
</script>

<template>
  <h1>ServiceList</h1>
  <div>
    <template v-for="service in services">
      <ServiceItem :service-id="service.id"/>
    </template>
  </div>
</template>

<style scoped>

</style>