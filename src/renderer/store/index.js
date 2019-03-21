import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import notifyPlugin from '../components/plugins/notify'

Vue.use(Vuex)
Vue.use(notifyPlugin)

let notifier = new Vue()

export default new Vuex.Store({
    modules,
    actions: {
        NOTIFY_SUCCESS(context, msg) {
            notifier.$notify.success(msg)
        },
        NOTIFY_ERROR(context, msg) {
            notifier.$notify.error(msg)
        }
    },
    strict: process.env.NODE_ENV !== 'production'
})
