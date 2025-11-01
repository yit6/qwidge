import { createRouter, createWebHistory } from 'vue-router'
import Landing from "@/components/Landing.vue";
import ServiceList from "@/components/ServiceList.vue";
import Service from "@/components/Service.vue";

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Landing },
        { path: '/services', component: ServiceList },
        { path: '/services/:id', component: Service },
    ]
})
