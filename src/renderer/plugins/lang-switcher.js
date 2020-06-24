import path from 'path'
import VueFlags from "@growthbunker/vueflags";
import { DropdownPlugin } from 'bootstrap-vue'
import LangSwitcher from './LangSwitcher/Component'
import { getStatic } from '@root/lib/static'

const LangSwitcherPlugin = {
    install(Vue) {
        // Dependancy
        Vue.use(DropdownPlugin)
        Vue.use(VueFlags, { iconPath: getStatic('/flags/') })
        // Custom component
        Vue.component("LangSwitcher", LangSwitcher)
    }
}

export default LangSwitcherPlugin