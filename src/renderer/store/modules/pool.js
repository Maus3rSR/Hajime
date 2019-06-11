import { getField, updateField } from 'vuex-map-fields'

const STATUS_LIST = {
    NOTHING: "NOTHING",
    SAVING: "SAVING",
    LOADING: "LOADING"
}

const defaultState = () => ({
    status: STATUS_LIST.NOTHING,
    list: [],
    model: {
        id: null,
        competition_id: null,
    }
})

const state = defaultState()

const getters = {
    getField,
    is_empty: state => null == state.model.id,
    loading: state => state.status == STATUS_LIST.LOADING,
    saving: state => state.status == STATUS_LIST.SAVING,
    count: state => state.list.length,
}

const mutations = {
    updateField,
    RESET_STATE(state) {
        Object.assign(state, defaultState())
    },
    INJECT_MODEL_DATA(state, model) {
        Object.assign(state.model, model)
    },
    UPDATE_MODEL_ID(state, id) {
        state.model.id = parseInt(id, 10)
    },
    STATUS_START(state, status) {
        state.status = status
    },
    STATUS_STOP(state) {
        state.status = STATUS_LIST.NOTHING
    }
}

const actions = {
    CLEAR({ commit }) {
        commit("RESET_STATE")
    },
    SAVE({ dispatch, commit }) {
        commit('STATUS_START', STATUS_LIST.SAVING)
        return new Promise((resolve, reject) => {
            // TODO API SAVE DATA
            setTimeout(() => {
                commit('STATUS_STOP')
                dispatch('NOTIFY_SUCCESS', 'La poule a bien été sauvegardée', { root: true })
                commit('UPDATE_MODEL_ID', 1) // TODO DEV : Remplacer par le retour API
                resolve()
            }, 1500)
        })
    },
    LOAD({ dispatch, commit }, id) {
        dispatch('CLEAR')
        commit('STATUS_START', STATUS_LIST.LOADING)

        // TODO DEV : Supprimer à terme
        let model = defaultState().model

        return new Promise((resolve, reject) => {
            // TOTO API GET DATA
            setTimeout(() => {
                commit('STATUS_STOP')
                commit('INJECT_MODEL_DATA', model)
                resolve()
            }, 3000)
        })
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