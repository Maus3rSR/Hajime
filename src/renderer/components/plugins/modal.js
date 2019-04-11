import ModalConfirmation from './Modal/Confirmation'
import ModalDeleteConfirmation from './Modal/DeleteConfirmation'

const ModalPlugin = {
    install(Vue) {
        Vue.component("ModalConfirmation", ModalConfirmation)
        Vue.component("ModalDeleteConfirmation", ModalDeleteConfirmation)
    }
}

export default ModalPlugin;