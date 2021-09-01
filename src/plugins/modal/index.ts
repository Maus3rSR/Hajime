import type { App, Plugin } from 'vue'
import Modal from './components/Modal.vue'
import ModalConfirmation from './components/ModalConfirmation.vue'
import ModalForm from './components/ModalForm.vue'

const install = (app: App) => {
    app.component('Modal', Modal)
    app.component('ModalConfirmation', ModalConfirmation)
    app.component('ModalForm', ModalForm)
    return app
}

export { Modal, ModalConfirmation, ModalForm }
export default { install } as typeof Plugin
