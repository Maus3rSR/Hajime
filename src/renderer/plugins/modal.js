import { ModalPlugin as ModalBootstrapVuePlugin } from 'bootstrap-vue'
import ModalConfirmation from './Modal/Confirmation'
import ModalDeleteConfirmation from './Modal/DeleteConfirmation'

const ModalPlugin = {
    install(Vue) {
        // Dependancy
        Vue.use(ModalBootstrapVuePlugin)
        // Custom component
        Vue.component("ModalConfirmation", ModalConfirmation)
        Vue.component("ModalDeleteConfirmation", ModalDeleteConfirmation)
    }
}

export default ModalPlugin