import { createRouter, createWebHistory } from 'vue-router'
import Landing from "@/pages/Landing.vue";
import ServiceList from "@/pages/Services.vue";
import Service from "@/pages/ServicePage.vue";
import ChatPage from "@/pages/ChatPage.vue";
import SearchResults from "@/pages/SearchResults.vue";

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Landing },
        { path: '/services', component: ServiceList },
        { path: '/services/:id', component: Service },
        { path: '/chat/:existingMessage', name:'chat', component: ChatPage, props:true },
	{ path: '/search/', component: SearchResults },
    ]
})
