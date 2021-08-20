import { createRouter, createWebHistory } from 'vue-router'

import Software from '/components/layouts/Software.vue'

const routes: Array<Object> = [
        {
            path: '/',
            component: Software,
            meta: { breadcrumb: 'router.home' },
        },
    ],
    router = createRouter({ routes, history: createWebHistory() })

export default router
