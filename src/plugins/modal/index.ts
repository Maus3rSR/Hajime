import type { App, Plugin, Component } from 'vue'
import Modal from './components/Modal.vue'
import ModalConfirmation from './components/ModalConfirmation.vue'
import ModalForm from './components/ModalForm.vue'

type ModalFormComponent = Component & {
    show: Function
    close: Function
}

const install = (app: App) => {
    app.component('Modal', Modal)
    app.component('ModalConfirmation', ModalConfirmation)
    app.component('ModalForm', ModalForm)
    return app
}

export type { ModalFormComponent }
export { Modal, ModalConfirmation, ModalForm }
export default { install } as Plugin
