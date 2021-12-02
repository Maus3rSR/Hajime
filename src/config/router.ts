import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import Software from '@/components/layouts/Software.vue'

const routes: Array<RouteRecordRaw> = [
        {
            path: '/',
            name: 'Software',
            component: Software,
            meta: { breadcrumb: 'router.home' },
        },
    ],
    router = createRouter({ routes, history: createWebHistory() })

export default router
