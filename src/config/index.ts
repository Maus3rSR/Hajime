import type { App } from 'vue'
import router from './router'
import i18n from './i18n'
import { setup as veeValidateSetup } from './vee-validate'

const install = (app: App): App => {
    app.use(router)
    app.use(i18n)

    veeValidateSetup()

    return app
}

export default { install }
