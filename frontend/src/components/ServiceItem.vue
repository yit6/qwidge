<script setup lang="ts">
import { getService, Service } from '@/ServicesService';
import { ref, Ref } from "vue";

const { serviceId, raw } = defineProps(['serviceId', 'raw']);

// Initialize the service data
let service: Ref<Service> = ref(null);

// Check if serviceId exists and fetch the service
if (!serviceId) {
  service.value = { id: -1, title: "???", description: "your dream service", imageUrl: "", rating: 0, sources: [] };
} else {
  getService(serviceId).then((r: number) => service.value = r);
}

// Define a class for color alternation (red or blue)
const cardColorClass = serviceId % 2 === 0 ? 'red-card' : 'blue-card';
</script>

<template>
  <!-- Only render the service card if the service data is loaded -->
  <router-link v-if="service" :to="'/services/' + service.id" :class="['service-card', cardColorClass]">
    <h1>{{ service.title }}</h1>
    <h2>Provided by: {{ service.organization }}</h2>
    <p>{{ service.description }}</p>
  </router-link>

  <!-- Error message if service is not found -->
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

/* Hover effects */
.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

/* Service card content styling */
.service-card h1 {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.service-card h2 {
  font-size: 1rem;
  margin-bottom: 10px;
}

.service-card p {
  font-size: 1rem;
  line-height: 1.4;
  color: white;
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