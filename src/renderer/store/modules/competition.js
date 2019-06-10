import { getField, updateField } from 'vuex-map-fields'
import faker from 'faker'

faker.locale = 'fr'

const TYPE_LIST = {
    INDI: "INDI",
    TEAM: "TEAM"
}

const STATUS_LIST = {
    NOTHING: "NOTHING",
    SAVING: "SAVING",
    LOADING: "LOADING"
}

// TODO : Séparer en sous-module ? List / Model
const defaultState = () => ({
    status: STATUS_LIST.NOTHING,
    list: [],
    model: {
        id: null,
        choosen_formula_id: null,
        name: null,
        date: null,
        place: null,
        owner: null,
        type: TYPE_LIST.INDI,
        locked: false,
        locked_fighter_list: false,
        fighter_list: [],
        formula_config_list: [],
    }
})

const state = defaultState()

const getters = {
    getField,
    is_empty: state => null == state.model.id,
    loading: state => state.status == STATUS_LIST.LOADING,
    saving: state => state.status == STATUS_LIST.SAVING,
    count: state => state.list.length,
    fighter_count: state => state.model.fighter_list.length,
    fighter_present_list: state => state.model.fighter_list.filter(fighter => fighter.is_present),
    fighter_missing_list: state => state.model.fighter_list.filter(fighter => !fighter.is_present),
    fighter_present_count: (state, getters) => getters.fighter_present_list.length,
    fighter_missing_count: (state, getters) => getters.fighter_missing_list.length,
    is_all_fighter_present: (state, getters) => getters.fighter_count == getters.fighter_present_count,
    is_all_fighter_missing: (state, getters) => getters.fighter_count == getters.fighter_missing_count,
    constant_type_list: () => TYPE_LIST,
    type_list: () => [
        {
            id: 1,
            name: "Individuelle",
            value: TYPE_LIST.INDI
        },
        {
            id: 2,
            name: "Equipe",
            value: TYPE_LIST.TEAM
        },
    ],
    default_type: () => defaultState().type,
    findFormulaConfigIndex: state => formula_config => state.model.formula_config_list.findIndex(el => el.name == formula_config.name)
}

const mutations = {
    updateField,
    ADD_FORMULA_CONFIG(state, formula_config) {
        state.model.formula_config_list.push(formula_config)
    },
    UPDATE_FORMULA_CONFIG(state, { index, formula_config }) {
        state.model.formula_config_list.splice(index, 1, formula_config)
    },
    RESET_FORMULA_CONFIG_LIST(state) {
        state.model.formula_config_list = []
    },
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
    SAVE_FORMULA_CONFIG({ getters, commit }, formula_config) {
        const index = getters.findFormulaConfigIndex(formula_config)

        if (index == -1)
            commit("ADD_FORMULA_CONFIG", formula_config)
        else
            commit("UPDATE_FORMULA_CONFIG", { index, formula_config })
    },
    SAVE({ dispatch, commit }) {
        commit('STATUS_START', STATUS_LIST.SAVING)
        return new Promise((resolve, reject) => {
            // TODO API SAVE DATA
            setTimeout(() => {
                commit('STATUS_STOP')
                dispatch('NOTIFY_SUCCESS', 'La compétition a bien été sauvegardée', { root: true })
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
        model.license = id
        model.choosen_formula_id = 1
        model.name = "Nom de la compétition"
        model.date = "19/07/2020"
        model.place = faker.address.city()
        model.owner = faker.name.findName()

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