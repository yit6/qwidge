<script setup lang="ts">

import { useRoute } from "vue-router";
import { getSearch } from "@/ServicesService.ts";
import { Ref, ref } from "vue";
import ServiceItem from "@/components/ServiceItem.vue";

let services: Ref<Service[]> = ref([]);

getSearch(useRoute().params.text).then((a) => { services.value = a; });

</script>

<template>
	<h1>Search results</h1>
	<div>
		<template v-for="service in services">
			<ServiceItem :service-id="service.id"/>
		</template>
	</div>
</template>
