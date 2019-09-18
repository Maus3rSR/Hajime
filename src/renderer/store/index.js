import Vue from 'vue'
import Vuex from 'vuex'
import { sequelize } from '@root/database'
import notifyPlugin from '@components/plugins/notify'
import pdfPlugin from '@components/plugins/pdf'
import modules from './modules'

Vue.use(Vuex)
Vue.use(notifyPlugin)

let notifier = new Vue()

const store = new Vuex.Store({
    modules,
    state: {
        db_connected: false,
        db_connection_error: false,
        db_is_connecting: false
    },
    getters: {
        db_not_connected_by_error: state => !state.db_connected && state.db_connection_error
    },
    mutations: {
        DB_CONNECTION_SUCCESS(state) {
            state.db_connected = true
            state.db_connection_error = false
        },
        DB_CONNECTION_ERROR(state) {
            state.db_connected = false
            state.db_connection_error = true
        },
        START_DB_CONNECTION(state) {
            state.db_is_connecting = true
        },
        STOP_DB_CONNECTION(state) {
            state.db_is_connecting = false
        }
    },
    actions: {
        NOTIFY_SUCCESS(context, msg) {
            notifier.$notify.success(msg)
        },
        NOTIFY_ERROR(context, msg) {
            notifier.$notify.error(msg)
        },
        CONNECT_DATABASE({ commit }) {
            commit("START_DB_CONNECTION")
            sequelize.authenticate()
                .then(() => commit("DB_CONNECTION_SUCCESS"))
                .catch(() => {
                    commit("DB_CONNECTION_ERROR")
                    notifier.$notify.error("Un problème est survenue lors de la connexion à la base de donnée")
                })
                .finally(() => commit("STOP_DB_CONNECTION"))
        }
    },
    plugins: [pdfPlugin.storePlugin],
    strict: process.env.NODE_ENV !== 'production'
})

store.dispatch("CONNECT_DATABASE") // Auto connect

export default store