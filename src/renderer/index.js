import { remote, ipcRenderer, shell } from 'electron'
import Vue from 'vue'
import axios from 'axios'
import VeeValidate from 'vee-validate'
import VueMask from 'v-mask'

import App from './App'
import router from './router'
import store from './store'
import plugins from './plugins'

const os = require('os')
const { app } = remote

Vue.config.productionTip = process.env.NODE_ENV === 'production'
if (process.env.ELECTRON_WEBPACK_IS_DEBUG_BUILD)
Vue.config.devtools = true

Vue.os = Vue.prototype.$os = os
Vue.shell = Vue.prototype.$shell = shell
Vue.ipc = Vue.prototype.$ipc = ipcRenderer
Vue.app = Vue.prototype.$app = {
    version: app.getVersion(),
    name: app.getName()
}
Vue.http = Vue.prototype.$http = axios

Object.keys(plugins).forEach(key => {
    Vue.use(plugins[key])
})
Vue.use(VeeValidate) // @TODO Problem when loaded as a plugin
Vue.use(VueMask) // @TODO Problem when loaded as a plugin

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
