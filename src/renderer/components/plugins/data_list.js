import { VueGoodTable } from 'vue-good-table'
import { ModalPlugin, PopoverPlugin } from 'bootstrap-vue'
import Component from './DataList/Component'

const DataListPlugin = {
    install(Vue) {
        // Dependancy
        Vue.use(ModalPlugin)
        Vue.use(PopoverPlugin)
        Vue.component('VueGoodTable', VueGoodTable)
        // Custom component
        Vue.component("DataList", Component)
    }
}

export default DataListPlugin