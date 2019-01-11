import ModalDeleteConfirmation from './ModalDeleteConfirmation/Component'

const ModalDeleteConfirmationPlugin = {
    install(Vue) {
        Vue.component("ModalDeleteConfirmation", ModalDeleteConfirmation)
    }
}

export default ModalDeleteConfirmationPlugin;