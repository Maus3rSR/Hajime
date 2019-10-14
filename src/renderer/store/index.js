import Vue from 'vue'
import Vuex from 'vuex'
import { sequelize } from '@root/database'
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
        CONNECT_DATABASE({ commit }) {
            commit("START_DB_CONNECTION")
            sequelize.authenticate()
                .then(() => commit("DB_CONNECTION_SUCCESS"))
                .catch(() => {
                    commit("DB_CONNECTION_ERROR")
                    this.$notify.error("Un problème est survenue lors de la connexion à la base de donnée")
                })
                .finally(() => commit("STOP_DB_CONNECTION"))
        }
    },
    strict: process.env.NODE_ENV !== 'production'
})

store.$notify = Vue.notify
store.$pdf = Vue.pdf
store.$configuration = Vue.configuration

// store.dispatch("CONNECT_DATABASE") // Auto connect

export default store