import { createRouter, createWebHistory } from 'vue-router'
import Landing from "@/pages/Landing.vue";
import ServiceList from "@/pages/Services.vue";
import Service from "@/pages/ServicePage.vue";

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Landing },
        { path: '/services', component: ServiceList },
        { path: '/services/:id', component: Service },
    ]
})
