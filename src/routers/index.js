import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/home',
        component: () => import('../layouts/MainLayout.vue'),
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () => import('../views/Home.vue'),
            },
        ]
    },
    {
        path: '/record-history',
        name: 'RecordHistory',
        component: () => import('../views/RecordHistory.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router