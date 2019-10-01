import { Sequelize, sequelize, mapModels } from '@root/database'
import { getField, updateField } from 'vuex-map-fields'
import faker from 'faker'

faker.locale = 'fr'

// IMPORT MODELS
const { Competition, CompetitionFighter, CompetitionFormula, Meta } = 
    mapModels(['Competition', 'CompetitionFighter', 'CompetitionFormula', 'Meta'])
// DEFINES RELATIONSHIP
const Fighters = Competition.hasMany(CompetitionFighter, { as: 'fighter_list', foreignKey: 'competition_id' })
const Formulas = Competition.hasMany(CompetitionFormula, { as: 'formula_config_list', foreignKey: 'competition_id' })

Formulas.Metas = CompetitionFormula.hasMany(Meta, {
    foreignKey: 'metaable_id',
    constraints: false,
    scope: { metaable: 'CompetitionFormula' },
    as: 'meta_list'
})

const TYPE_LIST = { INDI: "INDI", TEAM: "TEAM" }
const STATUS_LIST = { NOTHING: "NOTHING", SAVING: "SAVING", LOADING: "LOADING" }

const defaultState = () => ({
    status: STATUS_LIST.NOTHING,
    status_list: STATUS_LIST.NOTHING,
    list: [],
    list_total: 0,
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

const formatFormulaConfiguration = formula_config => {
    let competition_formula = { name: formula_config.name, meta_list: [] }
    
    Object.keys(formula_config.config).forEach(config_name => {
        competition_formula.meta_list.push({
            key: config_name,
            value: formula_config.config[config_name]
        })
    })

    return competition_formula
}

const state = defaultState()

const getters = {
    getField,
    is_empty: state => null == state.model.id,
    loading: state => state.status == STATUS_LIST.LOADING,
    list_loading: state => state.status_list == STATUS_LIST.LOADING,
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
        state.model.formula_config_list.push(formatFormulaConfiguration(formula_config))
    },
    UPDATE_FORMULA_CONFIG(state, { index, formula_config }) {
        state.model.formula_config_list.splice(index, 1, formatFormulaConfiguration(formula_config))
    },
    RESET_STATE(state) {
        Object.assign(state, defaultState())
    },
    INJECT_MODEL_DATA(state, model) {
        Object.assign(state.model, model)
    },
    UPDATE_MODEL_ID(state, id) {
        state.model.id = parseInt(id, 10)
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
    SAVE({ dispatch, commit, state }) {
        commit("updateField", { path: 'status', value: STATUS_LIST.SAVING })

        const promise = sequelize.transaction(t => {
            return Competition.create(state.model, {
                transaction: t,
                include: [{
                    association: Fighters,
                    as: 'fighter_list'
                }, {
                    association: Formulas,
                    as: 'formula_config_list',
                    include: [{
                        association: Formulas.Metas,
                        as: 'meta_list'
                    }]
                }]
            })
        })

        promise
            .then(competition => {
                dispatch('NOTIFY_SUCCESS', 'La compétition a bien été sauvegardée', { root: true })
                commit('UPDATE_MODEL_ID', competition.id)
            })
            .catch(Sequelize.UniqueConstraintError, () => 
                dispatch('NOTIFY_ERROR', 'Impossible de sauvegarder, il y a des doublons de licence dans la liste des combattants !', { root: true })
            )
            .catch(() =>
                dispatch('NOTIFY_ERROR', 'Un problème est survenu lors de la sauvegarde de la compétition', { root: true })
            )
            .finally(() => commit("updateField", { path: 'status', value: STATUS_LIST.NOTHING }))

        return promise
    },
    LOAD({ dispatch, commit }, id) {
        dispatch('CLEAR')
        commit("updateField", { path: 'status', value: STATUS_LIST.LOADING })

        let promise = Competition.findByPk(id, {
            include: [{
                model: CompetitionFighter,
                as: 'fighter_list'
            },
            {
                model: CompetitionFormula,
                as: 'formula_config_list',
                include: [{
                    model: Meta,
                    as: 'meta_list'
                }]
            }]
        })
        
        promise.then(competition => {
            commit('INJECT_MODEL_DATA', competition.get({ plain: true }))
        }).catch(() => 
            dispatch('NOTIFY_ERROR', 'Un problème est survenu lors de la récupération des compétitions', { root: true })
        ).finally(() => commit("updateField", { path: 'status', value: STATUS_LIST.NOTHING }))

        return promise
    },
    LOAD_LIST({ dispatch, commit }, payload) {
        commit("updateField", { path: 'status_list', value: STATUS_LIST.SAVING })

        const current_limit = payload.limit * payload.page
        const offset = current_limit - payload.limit

        let promise = Competition.findAndCountAll({
            limit: current_limit,
            offset: offset
        })
        
        promise.then(result => {
            commit("updateField", { path: 'list_total', value: result.count })
            commit("updateField", { path: 'list', value: result.rows.map(row => row.get({ plain: true })) })
        }).catch(() => 
            dispatch('NOTIFY_ERROR', 'Un problème est survenu lors de la récupération des compétitions', { root: true })
        ).finally(() => commit("updateField", { path: 'status_list', value: STATUS_LIST.NOTHING }))

        return promise
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