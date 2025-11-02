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
		<template v-for="service in services">
			<ServiceItem :service-id="service.id"/>
		</template>
	</div>
</template>
