import { getField, updateField } from 'vuex-map-fields'

const type_list = {
    INDI: "INDI",
    TEAM: "TEAM"
}

const defaultState = () => ({
    locked: false,
    name: null,
    date: null,
    place: null,
    owner: null,
    type: type_list.INDI,
    fighter_list: [],
})

const state = defaultState()

const getters = {
    getField,
    is_locked: state => state.locked,
    fighter_list: state => state.fighter_list,
    constant_type_list: () => type_list,
    type_list: () => [
        {
            txt: "Individuelle",
            value: type_list.INDI
        },
        {
            txt: "Equipe",
            value: type_list.TEAM
        },
    ],
    default_type: () => defaultState().type
}

const mutations = {
    updateField,
    RESET_STATE(state) {
        Object.assign(state, defaultState())
    }
}

const actions = {
    CLEAR({ commit }) {
        commit("RESET_STATE")
    },
    SAVE_COMPETITION() {
        // TODO API SAVE DATA
    },
}

export default {
    namespaced: true,
    strict: process.env.NODE_ENV !== 'production',
    state,
    getters,
    mutations,
    actions
}