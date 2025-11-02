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
    <section id="trending-section">
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
#trending-section {
    background-color: white;
    color: black;
    padding: 10px 20px;
}
.toptext {
    display: flex;
    justify-content: space-between;
}

.trending-tiles {
  display: flex;
  flex-wrap: wrap; /* Ensures elements wrap to the next line if there are too many */
  gap: 10px; /* Space between elements */
}

.trending-tiles > * {
  flex: 1 1 200px; /* Ensures the items are flexible and have a base width of 200px (can be adjusted) */
  height: 200px; /* Square height for each tile */
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.trending-tiles > :nth-child(odd) {
  background-color: #ff5722; /* Red background for odd elements */
}

.trending-tiles > :nth-child(even) {
  background-color: #2196f3; /* Blue background for even elements */
}

</style>