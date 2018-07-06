import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import plugins from './components/plugins'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Object.keys(plugins).forEach(key => {
    Vue.use(plugins[key])
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
