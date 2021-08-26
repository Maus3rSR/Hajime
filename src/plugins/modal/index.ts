import type { App, Plugin } from 'vue'
import Modal from './components/Modal.vue'
import ModalConfirmation from './components/ModalConfirmation.vue'

const install = (app: App) => {
    app.component('Modal', Modal)
    app.component('ModalConfirmation', ModalConfirmation)
    return app
}

export { Modal, ModalConfirmation }
export default { install } as typeof Plugin
