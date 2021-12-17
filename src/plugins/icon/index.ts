import type { App, Plugin } from 'vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(far, fas, fab)

const install = (app: App) => {
    app.component('FontAwesomeIcon', FontAwesomeIcon)
    return app
}

export { FontAwesomeIcon }
export default { install } as Plugin
