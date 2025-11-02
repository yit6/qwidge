<script setup lang="ts">
import { getService, Service } from '@/ServicesService';
import {ref, Ref} from "vue";
const { serviceId, raw } = defineProps(['serviceId','raw'])

let service: Ref<Service> = ref(null);
if(raw) {
  service.value = { id: -1, title: "???", description: "your dream service", imageUrl:"", rating: 0, sources: [] }
}
else {
  getService(serviceId).then((r: number) => service.value = r);
}
</script>

<template>
    <router-link v-if="service" :to="'/services/'+service.id" class="card">
        <h1>{{ service.title }}</h1>
        <p>{{ service.description }}</p>
    </router-link>
</template>

<style scoped>
.card {
  padding: 5px;
  border-style: solid;
  border-color: black;
  display: flex;
  flex-direction: column;
  margin: 5px;
}

</style>