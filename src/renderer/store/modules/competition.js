import { getField, updateField } from 'vuex-map-fields'

const type_list = {
    INDI: "INDI",
    TEAM: "TEAM"
}

// TODO : Séparer en sous-module ? List / Model / ModelRelated
const defaultState = () => ({
    list: [],
    saving: false,
    model: {
        id: 1, // TODO : Temporaire, mettre à null à terme
        choosen_formula_id: null,
        name: null,
        date: null,
        place: null,
        owner: null,
        type: type_list.INDI,
        locked: false,
    },
    model_related: {
        fighter_list: [],
        formula_config_list: [],
    }
})

const state = defaultState()

const getters = {
    getField,
    count: state => state.list.length,
    fighter_count: state => state.model_related.fighter_list.length,
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
    default_type: () => defaultState().type,
    findFormulaConfigIndex: state => formula_config => state.model_related.formula_config_list.findIndex(el => el.name == formula_config.name)
}

const mutations = {
    updateField,
    ADD_FORMULA_CONFIG(state, formula_config) {
        state.model_related.formula_config_list.push(formula_config)
    },
    UPDATE_FORMULA_CONFIG(state, { index, formula_config }) {
        state.model_related.formula_config_list.splice(index, 1, formula_config)
    },
    RESET_FORMULA_CONFIG_LIST(state) {
        state.model_related.formula_config_list = []
    },
    RESET_STATE(state) {
        Object.assign(state, defaultState())
    },
    SAVE_START(state) {
        state.saving = true
    },
    SAVE_STOP(state) {
        state.saving = false
    }
}

const actions = {
    CLEAR({ commit }) {
        commit("RESET_STATE")
    },
    SAVE_FORMULA_CONFIG({ getters, commit }, formula_config) {
        const index = getters.findFormulaConfigIndex(formula_config)

        if (index == -1)
            commit("ADD_FORMULA_CONFIG", formula_config)
        else
            commit("UPDATE_FORMULA_CONFIG", { index, formula_config })
    },
    SAVE({ dispatch, commit }) {
        commit('SAVE_START')
        return new Promise((resolve, reject) => {
            // TODO API SAVE DATA
            setTimeout(() => {
                commit('SAVE_STOP')
                dispatch('NOTIFY_SUCCESS', 'La compétition a bien été sauvegardée', { root: true })
                resolve()
            }, 1000)
        })
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