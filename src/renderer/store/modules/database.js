import { CreateSequelizeInstance } from '@root/database'

let sequelize_instance = null // We must not set it in the state because the object make internal updates when used and we can't handle these changes

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
    RESET_INSTANCE() {
        sequelize_instance = null
    },
    SEQUELIZE_INSTANCE(state, conf) {
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
    CONNECT({ commit }, conf) {
        if (null === sequelize_instance) {
            conf = conf || this.$configuration.get('database')
            
            if (undefined === conf)
            {
                this.$notify.error("Impossible de se connecter à la base de données. Aucune configuration trouvée.")
                commit("CONNECTION_ERROR")
                return Promise.reject()
            }
            commit("SEQUELIZE_INSTANCE", conf)
        }

        commit("START_CONNECTION")
        return sequelize_instance.authenticate()
            .then(() => commit("CONNECTION_SUCCESS"))
            .catch(() => {
                commit("CONNECTION_ERROR")
                this.$notify.error("Un problème est survenue lors de la connexion à la base de donnée")
            })
            .finally(() => commit("STOP_CONNECTION"))
    },
    DISCONNECT({ commit }) {
        return sequelize_instance.close()
            .then(() => commit("DISCONNECT_SUCCESS"))
            .catch(() => this.$notify.error("Un problème est survenue lors de la déconnexion à la base de donnée"))
    }
}

export default {
    namespaced: true,
    strict: process.env.NODE_ENV !== 'production',
    state,
    getters,
    mutations,
    actions
}