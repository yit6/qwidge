<script setup lang="ts">
  import ServiceItem from "@/components/ServiceItem.vue";
  import {getServices, Service} from "@/ServicesService.ts";
  import {getCurrentInstance, Ref, ref} from "vue";

  let services: Ref<Service[]> = ref([]);
  getServices().then(r => services.value = r);
  console.log(services)
</script>

<template>
  <h1>ServiceList</h1>
  <div id="service-list">
    <template v-for="service in services">
      <ServiceItem :service-id="service.id"/>
    </template>
  </div>
</template>

<style scoped>
#service-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

</style>