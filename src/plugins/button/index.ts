import type { App, Plugin } from 'vue'
import TempoButton from './components/TempoButton.vue'

const install = (app: App) => {
    app.component('TempoButton', TempoButton)
    return app
}

export default { install } as Plugin
