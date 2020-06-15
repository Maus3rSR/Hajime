import Vue from 'vue'
import { getField, updateField } from 'vuex-map-fields'
import { LOADER_STATUS } from '@root/constant'
import fight from './fight'

const modules = { fight }

const defaultState = () => ({
    status: LOADER_STATUS.NOTHING,
    status_list: LOADER_STATUS.NOTHING,
    list: [],
    configuration: {
        id: null,
        competition_formula_id: null,
        third_place: 1,
        repulse_favorite: false,
        repulse_club: false,
        locked: false,
    }
})

const state = defaultState()

const getters = {
    getField,
    is_configuration_empty: state => null === state.configuration.id,
    loading: state => state.status === LOADER_STATUS.LOADING,
    list_loading: state => state.status_list === LOADER_STATUS.LOADING,
    saving: state => state.status === LOADER_STATUS.SAVING,
    count: state => state.list.length,
}

const mutations = {
    updateField,
    RESET_STATE(state) {
        Object.assign(state, defaultState())
    },
    SET_CONFIGURATION(state, config) {
        Vue.set(state, 'configuration', config) // No reactivity issue here when using Object.assign...
    }
}

const actions = {
    CLEAR({ commit }) {
        commit("RESET_STATE")
    },
    CREATE({ dispatch, commit, getters, state, rootGetters, rootState }, entry_list) {
        console.log(entry_list)
    },
    SAVE_CONFIGURATION({ commit, getters, rootGetters, state }) {
        if (getters.saving)
            return

        commit("updateField", { path: 'status', value: LOADER_STATUS.SAVING })

        const { id, competition_formula_id, ...fields } = state.configuration
        const promise = rootGetters["database/getModel"]("TreeConfiguration").update(fields, { where: { id: parseInt(id, 10) } })

        promise
            .then()
            .catch(() => this.$notify.error("Un problème est survenu lors de la mise à jour de la configuration de l'arbre"))
            .finally(() => commit("updateField", { path: 'status', value: LOADER_STATUS.NOTHING }))

        return promise
    },
    LOAD_CONFIGURATION({ dispatch, commit, getters, rootGetters }, competition_formula_id) {
        if (getters.loading)
            return

        dispatch('CLEAR')
        commit("updateField", { path: 'status', value: LOADER_STATUS.LOADING })

        const promise = rootGetters["database/getModel"]("TreeConfiguration").findOne({ 
            where: { competition_formula_id: parseInt(competition_formula_id, 10) },
            include: [{
                association: "competition_formula",
                attributes: ["competition_id"],
                include: [{
                    association: "competition",
                    attributes: ["type"]
                }]
            }]
        })

        promise
            .then(config => commit('SET_CONFIGURATION', config.get({ plain: true })))
            .catch(err => console.log(err))
            .catch(() => this.$notify.error("Un problème est survenu lors de la récupération des informations de configuration de l'arbre"))
            .finally(() => commit("updateField", { path: 'status', value: LOADER_STATUS.NOTHING }))

        return promise
    },
    LOAD_LIST({ commit, getters, rootGetters, state }) {
        
    },
    // GENERATE_PDF({ getters }) { // @todo Exporter dans une lib javascript
    //     let doc = this.$pdf.getNewDocument()
    //     this.$pdf.open(doc)
    // }
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