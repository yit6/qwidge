<script setup lang="ts">
import ServiceItem from './ServiceItem.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter()

onMounted(() => {
    
})

function goToAllServices() {
    router.push('/services')
}
</script>

<template>
    <section>
        <div class="toptext">
            <h2>
                Trending
            </h2>
            <a @click="goToAllServices">View All</a>
        </div>
        <div class="trending-tiles">
            <service-item service-id="1"/>
            <service-item/>
            <service-item/>
        </div>
    </section>
</template>

<style scoped>
.toptext {
    display: flex;
    justify-content: space-between;
}

.trending-tiles {
    display: flex;
}
</style>