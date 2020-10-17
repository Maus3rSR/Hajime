import { BreadcrumbPlugin } from 'bootstrap-vue'
import Breadcrumb from './Breadcrumb/Component'

function install(Vue) {
    // Dependancy
    Vue.use(BreadcrumbPlugin)
    // Custom component
    Vue.component("Breadcrumb", Breadcrumb)
}

export default { install }