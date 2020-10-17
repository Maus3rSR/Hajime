import { DropdownPlugin } from 'bootstrap-vue'
import LangSwitcher from './LangSwitcher/Component'

const LangSwitcherPlugin = {
    install(Vue) {
        // Dependancy
        Vue.use(DropdownPlugin)
        // Custom component
        Vue.component("LangSwitcher", LangSwitcher)
    }
}

export default LangSwitcherPlugin