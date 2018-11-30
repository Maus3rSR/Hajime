import { Dropdown, Tabs } from 'bootstrap-vue/es/components'

const BootstrapVuePlugin = {
    install(Vue) {
        Vue.use(Dropdown)
        Vue.use(Tabs)
    }
}

export default BootstrapVuePlugin