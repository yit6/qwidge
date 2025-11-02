<script setup lang="ts">
import { getService, Service } from '@/ServicesService';
import { ref, Ref } from "vue";
const { serviceId, raw } = defineProps(['serviceId','raw']);

let service: Ref<Service> = ref(null);
if (!serviceId) {
  service.value = { id: -1, title: "???", description: "your dream service", imageUrl: "", rating: 0, sources: [] };
} else {
  getService(serviceId).then((r: number) => service.value = r);
}
const cardColorClass = serviceId % 2 === 0 ? 'red-card' : 'blue-card';
</script>

<template>
    <router-link v-if="service" :to="'/services/'+service.id" :class="['service-card', cardColorClass]">
        <div class="service-card-content">
            <h1>{{ service.title }}</h1>
            <p>{{ service.description }}</p>
        </div>
    </router-link>
    <p v-else>ERROR</p>
</template>

<style scoped>
/* Base styles for all service cards */
.service-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 20px;
  width: 200px; /* Square shape */
  height: 200px; /* Square shape */
  margin: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none; /* Remove underline on the link */
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

.service-card-content {
  color: white;
  text-align: center;
  flex-grow: 1; /* Ensures the content is centered */
}

.service-card-content h1 {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.service-card-content p {
  font-size: 1rem;
  line-height: 1.4;
}

/* Red card style */
.red-card {
  background-color: #ff5722; /* Red background */
}

/* Blue card style */
.blue-card {
  background-color: #2196f3; /* Blue background */
}
</style>