import type { App, Plugin } from 'vue'

import BreadcrumbRouter from './components/BreadcrumbRouter.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import BreadcrumbItem from './components/BreadcrumbItem.vue'

const install = (app: App) => {
    app.component(BreadcrumbRouter.name, BreadcrumbRouter)
    app.component(Breadcrumb.name, Breadcrumb)
    app.component(BreadcrumbItem.name, BreadcrumbItem)
    return app
}

export { BreadcrumbRouter, Breadcrumb, BreadcrumbItem }
export default { install } as typeof Plugin
