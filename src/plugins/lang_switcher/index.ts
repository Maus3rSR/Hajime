import type { App, Plugin } from 'vue'
import LangSwitcher from './components/LangSwitcher.vue'
import LangSwitcherFlag from './components/LangSwitcherFlag.vue'

const install = (app: App) => {
    app.component('LangSwitcher', LangSwitcher)
    app.component('LangSwitcherFlag', LangSwitcherFlag)
    return app
}

export { LangSwitcher, LangSwitcherFlag }
export default { install } as Plugin
