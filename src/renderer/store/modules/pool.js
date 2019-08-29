import { getField, updateField } from 'vuex-map-fields'

const STATUS_LIST = {
    NOTHING: "NOTHING",
    SAVING: "SAVING",
    LOADING: "LOADING"
}

const defaultState = () => ({
    status: STATUS_LIST.NOTHING,
    model: {
        id: null,
        competition_id: null,
        number_of_qualified_fighter: 1,
        number_of_pool: 1,
        number_of_entry_per_pool: 1,
        dismiss_favorite: false,
        lock: false,
        pool_list: []
    }
})

const state = defaultState()

const getters = {
    getField,
    is_empty: state => null == state.model.id,
    loading: state => state.status == STATUS_LIST.LOADING,
    saving: state => state.status == STATUS_LIST.SAVING,
    pool_count: state => state.model.pool_list.length,
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
    SAVE_ALL({ dispatch, commit }) { // Save model and pool_list
        commit('STATUS_START', STATUS_LIST.SAVING)
        return new Promise((resolve, reject) => {
            // TODO API SAVE DATA
            setTimeout(() => {
                commit('STATUS_STOP')
                dispatch('NOTIFY_SUCCESS', 'Les poules ont bien été sauvegardées', { root: true })
                resolve()
            }, 1500)
        })
    },
    LOAD({ dispatch, commit }, competition_id) {
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
    },
    GENERATE_PDF() {
        console.log("GENERATE PDF PLEASE !")
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