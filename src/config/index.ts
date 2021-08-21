import type { App } from 'vue'
import router from './router.ts'
import i18n from './i18n.ts'

const install = (app: App): App => {
    app.use(router)
    app.use(i18n)
    return app
}

export default { install }
