import Vue from 'vue'
import Vuex from 'vuex'
import notifyPlugin from '@root/plugins/notify'
import pdfPlugin from '@root/plugins/pdf'
import configurationPlugin from '@root/plugins/configuration'
import modules from './modules'

Vue.use(Vuex)
Vue.use(notifyPlugin)
Vue.use(pdfPlugin)
Vue.use(configurationPlugin)

const store = new Vuex.Store({
    modules,
    state: {},
    getters: {},
    mutations: {},
    actions: { },
    strict: process.env.NODE_ENV !== 'production'
})

store.$notify = Vue.notify
store.$pdf = Vue.pdf
store.$configuration = Vue.configuration

export default store