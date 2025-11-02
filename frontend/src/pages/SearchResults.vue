<script setup lang="ts">
import { useRoute } from "vue-router";
import { getSearch } from "@/ServicesService.ts";
import { Ref, ref } from "vue";
import ServiceItem from "@/components/ServiceItem.vue";
import { defineProps } from 'vue';

let services: Ref<Service[]> = ref([]);

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});

if (props.text) {
  getSearch(props.text).then((a) => { services.value = a; });
}
</script>

<template>
  <h1>Search results</h1>
  <div>
    <template v-for="service in services" :key="service.id">
      <ServiceItem :service-id="service.id"/>
    </template>
  </div>

  <!-- New section for "Didn't find what you're looking for?" -->
  <div class="no-results">
    <h1>Didn't find what you're looking for?</h1>
    <router-link to="/chat" class="chat-link"><h2>Chat with us</h2></router-link>
  </div>
</template>

<style scoped>
.no-results {
  margin-top: 20px;
  text-align: center;
}

.no-results h1 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.chat-link {
  font-size: 1.2rem;
  color: #2196f3;
  text-decoration: none;
}

.chat-link:hover {
  text-decoration: underline;
}
</style>