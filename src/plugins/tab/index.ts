import type { App, Plugin } from 'vue'
import Tabs from './components/Tabs.vue'
import Tab from './components/Tab.vue'

const install = (app: App) => {
    app.component('Tabs', Tabs)
    app.component('Tab', Tab)
    return app
}

export { Tabs, Tab }
export default { install } as Plugin
