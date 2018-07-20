import Vue from 'vue'
import axios from 'axios'
import VeeValidate from 'vee-validate';
import VueMask from 'v-mask'

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
Vue.use(VeeValidate);
Vue.use(VueMask);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
