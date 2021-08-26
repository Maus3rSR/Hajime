import type { App, Plugin } from 'vue'
import Modal from './components/Modal.vue'

const install = (app: App) => {
    app.component('Modal', Modal)
    return app
}

export { Modal }
export default { install } as typeof Plugin
