import { createRouter, createWebHistory } from 'vue-router'

import Software from '/components/layouts/Software.vue'

const routes: object[] = [
        {
            path: '/',
            component: Software,
        },
    ],
    router = createRouter({ routes, history: createWebHistory() })

export default router
