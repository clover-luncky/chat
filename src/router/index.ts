import type { App } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { ChatLayout } from '../views/chat/layout';

const routes: RouteRecordRaw[] = [{
    path: '/',
    name: 'Root',
    component: ChatLayout,
    redirect: '/chat',
    children: [{
        path: '/chat:uuid?',
        name: 'Chat',
        component: () => import('../views/chat/index.vue')
    }]
}]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior: () => ({ left: 0, top: 0 })
})

// setupPageGuard(router)
export async function setupRouter(app: App) {
    app.use(router)
    await router.isReady()
}