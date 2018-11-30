import { VueGoodTable } from 'vue-good-table';
import vBModal from 'bootstrap-vue/es/directives/modal/modal';
import Component from './DataList/Component'

const DataListPlugin = {
    install(Vue) {
        // Dependancy
        Vue.component('VueGoodTable', VueGoodTable)
        Vue.directive('b-modal', vBModal)
        // Custom component
        Vue.component("DataList", Component)
    }
}

export default DataListPlugin;