import {
    DropdownPlugin,
    TabsPlugin,
    ModalPlugin
} from 'bootstrap-vue'

const BootstrapVuePlugin = {
    install(Vue) {
        Vue.use(DropdownPlugin)
        Vue.use(TabsPlugin)
        Vue.use(ModalPlugin)
    }
}

export default BootstrapVuePlugin