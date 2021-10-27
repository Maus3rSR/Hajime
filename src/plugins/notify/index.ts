import type { App, Plugin } from 'vue'
import { createNotify, useNotify } from './composables/notify'
import 'mosha-vue-toastify/dist/style.css'

const install = (app: App) => {
    app.provide('notify', createNotify())
    return app
}

export { useNotify }
export default { install } as Plugin
