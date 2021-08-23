import type { App, Plugin } from 'vue'
import LangSwitcher from './components/LangSwitcher.vue'
import LangSwitcherFlag from './components/LangSwitcherFlag.vue'

const install = (app: App) => {
    app.component(LangSwitcher.name, LangSwitcher)
    app.component(LangSwitcherFlag.name, LangSwitcherFlag)
    return app
}

export { LangSwitcher, LangSwitcherFlag }
export default { install } as typeof Plugin
