<script setup lang="ts">
import { getService, Service } from '@/ServicesService';
const { serviceId } = defineProps(['serviceId'])

let service: Service = getService(serviceId);
if(!service) {
    service = { id: -1, title: "Dog Fish research", description: "Dog Fish are a very interesting species that many research facilities are not researching. The funding will go towards starting research papers on the species.", imageUrl: "https://i.ytimg.com/vi/5y9wG0o2oys/maxresdefault.jpg", rating: 5, sources: [] }
}
</script>

<template>
    <router-link :to="'/services/'+service.id" class="card">
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