import type { App, Plugin } from 'vue'

import LangSwitcher from './LangSwitcher.vue'

const install = (app: App) => {
    app.component(LangSwitcher.name, LangSwitcher)
    return app
}

export { LangSwitcher }
export default { install } as typeof Plugin
