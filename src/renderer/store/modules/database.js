import { sequelize } from '@root/database'

const defaultState = () => ({
    connected: false,
    connection_error: false,
    is_connecting: false
})

const state = defaultState()

const getters = {
    not_connected_by_error: state => !state.connected && state.connection_error
}

const mutations = {
    CONNECTION_SUCCESS(state) {
        state.connected = true
        state.connection_error = false
    },
    CONNECTION_ERROR(state) {
        state.connected = false
        state.connection_error = true
    },
    DISCONNECT_SUCCESS(state) {
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
    CONNECT({ commit }) {
        commit("START_CONNECTION")
        return sequelize.authenticate()
            .then(() => commit("CONNECTION_SUCCESS"))
            .catch(() => {
                commit("CONNECTION_ERROR")
                this.$notify.error("Un problème est survenue lors de la connexion à la base de donnée")
            })
            .finally(() => commit("STOP_CONNECTION"))
    },
    DISCONNECT({ commit }) {
        return sequelize.close()
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