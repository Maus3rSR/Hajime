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
    choosen_formula: null,
    type: type_list.INDI,
    fighter_list: [],
    formula_config_list: [],
})

const state = defaultState()

const getters = {
    getField,
    is_locked: state => state.locked,
    fighter_list: state => state.fighter_list,
    fighter_count: state => state.fighter_list.length,
    constant_type_list: () => type_list,
    type_list: () => [
        {
            id: 1,
            name: "Individuelle",
            value: type_list.INDI
        },
        {
            id: 2,
            name: "Equipe",
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