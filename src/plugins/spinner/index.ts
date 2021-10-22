import type { App, Plugin } from 'vue'
import { CirclesToRhombusesSpinner } from 'epic-spinners'

const install = (app: App) => {
    app.component('Spinner', CirclesToRhombusesSpinner)
    return app
}

export default { install } as Plugin
