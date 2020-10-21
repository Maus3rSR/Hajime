import { CreateSequelizeInstance } from '@root/database'
import migration from './database/migration'

import i18n from '@config/i18n'
import commonTranslations from '@lang/generic/common.json'
import translations from '@lang/store/database.json'

i18n.mergeLocaleMessage("gb", commonTranslations.gb)
i18n.mergeLocaleMessage("fr", commonTranslations.fr)
i18n.mergeLocaleMessage("gb", translations.gb)
i18n.mergeLocaleMessage("fr", translations.fr)

let sequelize_instance = null // We must not set it in the state because the object make internal updates when used and we can't handle these changes

const modules = { migration }

const defaultState = () => ({
    connected: false,
    error: false,
    is_connecting: false,
    model_list: {}
})

const state = defaultState()

const getters = {
    instance: () => sequelize_instance,
    is_empty_instance: () => null === sequelize_instance,
    getModel: state => model_name => {
        if (undefined === state.model_list[model_name])
            throw new Error("[STORE/DATABASE] Model " + model_name + " not found")
        return state.model_list[model_name]
    }
}

const mutations = {
    RESET() {
        sequelize_instance = null
    },
    INIT(state, conf) {
        let { sequelize, model_list } = CreateSequelizeInstance(conf)
        sequelize_instance = sequelize
        state.model_list = model_list
    },
    CONNECTION_SUCCESS(state) {
        state.connected = true
        state.error = false
    },
    CONNECTION_ERROR(state) {
        sequelize_instance = null
        state.model_list = {}
        state.connected = false
        state.error = true
    },
    DISCONNECT_SUCCESS() {
        state = defaultState()
    },
    START_CONNECTION(state) {
        state.is_connecting = true
    },
    STOP_CONNECTION(state) {
        state.is_connecting = false
    }
}

const actions = {
    AUTHENTICATE({ commit }) {
        if (null === sequelize_instance)
            return Promise.reject()

        commit("START_CONNECTION")
        const promise = sequelize_instance.authenticate()
        
        promise
            .catch(() => this.$notify.error(i18n.t("database.error.connection")))
            .finally(() => commit("STOP_CONNECTION"))
        
        return promise
    },
    TEST_CONNECTION({ dispatch, commit }, conf) {
        if (undefined === conf)
        {
            this.$notify.error(i18n.t("database.error.configuration.empty"))
            return Promise.reject()
        }
        commit("INIT", conf)

        const promise = dispatch("AUTHENTICATE")

        return promise
    },
    CONNECT({ dispatch, commit }) {
        if (null === sequelize_instance) {
            const conf = this.$configuration.get('database')
            
            if (undefined === conf)
            {
                this.$notify.error(i18n.t("database.error.configuration.noone"))
                commit("CONNECTION_ERROR")
                return Promise.reject()
            }
            commit("INIT", conf)
        }

        const promise = dispatch("AUTHENTICATE")

        promise
            .then(() => {
                commit("CONNECTION_SUCCESS")
                return dispatch("migration/INIT", sequelize_instance)
            })
            .catch(() => commit("CONNECTION_ERROR"))

        return promise
    },
    DISCONNECT({ commit }) {
        if (null === sequelize_instance)
            return Promise.resolve()

        return sequelize_instance.close()
            .then(() => commit("DISCONNECT_SUCCESS"))
            .catch(() => this.$notify.error(i18n.t("database.error.disconnection")))
    }
}

export default {
    namespaced: true,
    strict: process.env.NODE_ENV !== 'production',
    state,
    getters,
    mutations,
    actions,
    modules
}