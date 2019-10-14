import Vue from 'vue'
import axios from 'axios'
import VeeValidate from 'vee-validate'
import VueMask from 'v-mask'

import App from './App'
import router from './router'
import store from './store'
import plugins from './plugins'

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = process.env.NODE_ENV == 'production'

Object.keys(plugins).forEach(key => {
    Vue.use(plugins[key])
})
Vue.use(VeeValidate) // @TODO Problem when loaded as a plugin
Vue.use(VueMask) // @TODO Problem when loaded as a plugin

/* eslint-disable no-new */
new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
