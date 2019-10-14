import { Sequelize, sequelize, mapModels } from '@root/database'
import { getField, updateField } from 'vuex-map-fields'

// IMPORT MODELS
const { Competition, Fighter, CompetitionFormula, PoolConfiguration, TreeConfiguration } = 
    mapModels(['Competition', 'Fighter', 'CompetitionFormula', 'PoolConfiguration', 'TreeConfiguration'])
// DEFINES RELATIONSHIP
const CompetitionFighter = Competition.hasMany(Fighter, { as: 'fighter_list', foreignKey: 'competition_id' })
const FormulaOfCompetition = Competition.hasMany(CompetitionFormula, { as: 'formula_config_list', foreignKey: 'competition_id' })

FormulaOfCompetition.PoolConfiguration = CompetitionFormula.hasOne(PoolConfiguration, { as: 'pool_configuration', foreignKey: 'competition_formula_id' })
FormulaOfCompetition.TreeConfiguration = CompetitionFormula.hasOne(TreeConfiguration, { as: 'tree_configuration', foreignKey: 'competition_formula_id' })

const TYPE_LIST = { INDI: "INDI", TEAM: "TEAM" }
const STATUS_LIST = { NOTHING: "NOTHING", SAVING: "SAVING", LOADING: "LOADING", DELETING: "DELETING" }

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

const state = defaultState()

const getters = {
    getField,
    is_empty: state => null === state.model.id,
    loading: state => state.status === STATUS_LIST.LOADING,
    list_loading: state => state.status_list === STATUS_LIST.LOADING,
    saving: state => state.status === STATUS_LIST.SAVING,
    deleting: state => state.status === STATUS_LIST.DELETING,
    count: state => state.list.length,
    fighter_count: state => state.model.fighter_list.length,
    fighter_present_list: state => state.model.fighter_list.filter(fighter => fighter.is_present),
    fighter_missing_list: state => state.model.fighter_list.filter(fighter => !fighter.is_present),
    fighter_present_count: (state, getters) => getters.fighter_present_list.length,
    fighter_missing_count: (state, getters) => getters.fighter_missing_list.length,
    is_all_fighter_present: (state, getters) => getters.fighter_count === getters.fighter_present_count,
    is_all_fighter_missing: (state, getters) => getters.fighter_count === getters.fighter_missing_count,
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
    existFighter: (state, getters) => fighter_id => getters.findFighterIndex(fighter_id) !== -1,
    findFighterIndex: state => fighter_id => state.model.fighter_list.findIndex(el => parseInt(el.id, 10) === parseInt(fighter_id, 10)),
    findFormulaConfigIndex: state => formula_config => state.model.formula_config_list.findIndex(el => el.name == formula_config.name)
}

const mutations = {
    updateField,
    ADD_FORMULA_CONFIG(state, formula_config) {
        state.model.formula_config_list.push(JSON.parse(JSON.stringify(formula_config)))
    },
    UPDATE_FORMULA_CONFIG(state, { index, formula_config }) {
        state.model.formula_config_list.splice(index, 1, JSON.parse(JSON.stringify(formula_config)))
    },
    RESET_STATE(state) {
        Object.assign(state, defaultState())
    },
    INJECT_MODEL_DATA(state, model) {
        Object.assign(state.model, model)
    },
    UPDATE_FIGHTER(state, fighter) {
        const index = state.model.fighter_list.findIndex(el => parseInt(el.id, 10) === parseInt(fighter.id, 10))

        if (index === -1) {
            state.model.fighter_list.push(fighter)
            return
        }

        state.model.fighter_list.splice(index, 1, fighter)
    },
    REMOVE_FIGHTER(state, id) {
        const index = state.model.fighter_list.findIndex(el => parseInt(el.id, 10) === parseInt(id, 10))

        if (index === -1)
            return

        state.model.fighter_list.splice(index, 1)
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
    CREATE({ commit, getters, state }) {
        if (getters.saving)
            return

        commit("updateField", { path: 'status', value: STATUS_LIST.SAVING })

        const promise = sequelize.transaction(t => {
            return Competition.create(state.model, {
                transaction: t,
                include: [{
                    association: CompetitionFighter,
                    as: 'fighter_list'
                }, {
                    association: FormulaOfCompetition,
                    as: 'formula_config_list',
                    include: [{
                        association: FormulaOfCompetition.PoolConfiguration,
                        as: 'pool_configuration'
                    }, {
                        association: FormulaOfCompetition.TreeConfiguration,
                        as: 'tree_configuration'
                    }]
                }]
            })
        })

        promise
            .then(competition => {
                this.$notify.success("La compétition a bien été sauvegardée")
                commit('INJECT_MODEL_DATA', competition.get({ plain: true }))
            })
            .catch(Sequelize.UniqueConstraintError, () => this.$notify.error('Impossible de sauvegarder, il y a des doublons de licence dans la liste des combattants !'))
            .catch(Sequelize.ValidationError, msg => this.$notify.error(msg))
            .catch(() => this.$notify.error('Un problème est survenu lors de la sauvegarde de la compétition'))
            .finally(() => commit("updateField", { path: 'status', value: STATUS_LIST.NOTHING }))

        return promise
    },
    SAVE({ commit, getters, state }) {
        if (getters.saving)
            return

        commit("updateField", { path: 'status', value: STATUS_LIST.SAVING })

        if (state.model.locked)
        {
            this.$notify.error("Vous n'avez pas le droit de mettre à jour la compétition")
            return Promise.reject()
        }

        const { id, fighter_list, formula_config_list, ...fields } = state.model
        const promise = Competition.update(fields, { where: { id: parseInt(id, 10) }})

        promise
            .then(() => this.$notify.success('La compétition a bien été mise à jour'))
            .catch(() => this.$notify.error('Un problème est survenu lors de la mise à jour de la compétition'))
            .finally(() => commit("updateField", { path: 'status', value: STATUS_LIST.NOTHING }))        

        return promise
    },
    SAVE_FIGHTER({ commit, getters, state }, fighter) {
        if (getters.saving)
            return

        if (getters.is_empty) {
            this.$notify.error("Impossible de procéder à la sauvegarde de ce combattant. Aucune compétition n'est chargée.")
            return Promise.reject()
        }

        if (state.model.locked_fighter_list)
        {
            this.$notify.error("Vous n'avez pas le droit de mettre à jour les combattants")
            return Promise.reject()
        }

        const update = undefined !== fighter.id && null !== fighter.id

        if (update && !getters.existFighter(fighter.id)) {
            this.$notify.error("Impossible de procéder à l'édition d'un combattant inexistant")
            return Promise.reject()
        }

        if (!update)
            fighter.competition_id = state.model.id

        commit("updateField", { path: 'status', value: STATUS_LIST.SAVING })

        let promise
        if (update)
        {
            const { id, ...fields } = fighter
            promise = Fighter.update(fields, { where: { id: fighter.id, competition_id: state.model.id }})
        }
        else
            promise = Fighter.create(fighter)

        promise
            .then(f => {
                const value = update ? fighter : f.get({ plain: true })

                commit("UPDATE_FIGHTER", value)
                this.$notify.success('Le combattant a bien été sauvegardé')
            })
            .catch(() => this.$notify.error('Un problème est survenu lors de la sauvegarde du combattant'))
            .finally(() => commit("updateField", { path: 'status', value: STATUS_LIST.NOTHING }))

        return promise
    },
    DELETE_FIGHTER({ commit, getters }, fighter_id) {
        if (getters.deleting)
            return

        if (getters.is_empty) {
            this.$notify.error("Impossible de procéder à la suppression de ce combattant. Aucune compétition n'est chargée.")
            return Promise.reject()
        }
        
        if (state.model.locked_fighter_list)
        {
            this.$notify.error("Vous n'avez pas le droit de supprimer les combattants")
            return Promise.reject()
        }

        if (!getters.existFighter(fighter_id)) {
            this.$notify.error("Impossible de procéder à la suppression d'un combattant inexistant")
            return Promise.reject()
        }

        commit("updateField", { path: 'status', value: STATUS_LIST.DELETING })
        const promise = Fighter.destroy({ where: { id: fighter_id } })

        promise
            .then(() => {
                commit("REMOVE_FIGHTER", fighter_id)
                this.$notify.success('Le combattant a bien été supprimé')
            })
            .catch(() => this.$notify.error('Un problème est survenu lors de suppression du combattant'))
            .finally(() => commit("updateField", { path: 'status', value: STATUS_LIST.NOTHING }))

        return promise
    },
    BULK_UPDATE_FIGHTER({ commit, getters, state }, { id_list, field_list }) {
        if (getters.saving)
            return

        if (getters.is_empty) {
            this.$notify.error("Impossible de faire la mise à jour en masse de ces combattants. Aucune compétition n'est chargée.")
            return Promise.reject()
        }

        if (state.model.locked_fighter_list)
        {
            this.$notify.error("Vous n'avez pas le droit de mettre à jour les combattants")
            return Promise.reject()
        }

        if (!Array.isArray(id_list))
        {
            this.$notify.error('Les données ne sont pas valides pour cette mise à jour en masse des combattants')
            return Promise.reject()
        }

        commit("updateField", { path: 'status', value: STATUS_LIST.SAVING })
        const promise = Fighter.update(field_list, { where: { id: id_list, competition_id: state.model.id }})

        promise
            .then(() => {
                id_list.forEach(id => {
                    const index = getters.findFighterIndex(id)
                    Object.keys(field_list).forEach(field => commit("updateField", { path: "model.fighter_list[" + index + "]." + field, value: field_list[field]}))
                })

                this.$notify.success('La mise à jour a bien été effectuée')
            })
            .catch(() => this.$notify.error('Un problème est survenu lors de la mise à jour en masse des combattants'))
            .finally(() => commit("updateField", { path: 'status', value: STATUS_LIST.NOTHING }))

        return promise
    },
    LOAD({ dispatch, commit, getters }, id) {
        if (getters.loading)
            return

        dispatch('CLEAR')
        commit("updateField", { path: 'status', value: STATUS_LIST.LOADING })

        const promise = Competition.findByPk(parseInt(id, 10), {
            include: [{
                model: Fighter,
                as: 'fighter_list'
            },
            {
                model: CompetitionFormula,
                as: 'formula_config_list'
            }]
        })
        
        promise
            .then(competition => {
                commit('INJECT_MODEL_DATA', competition.get({ plain: true }))
            })
            .catch(() => this.$notify.error('Un problème est survenu lors de la récupération des compétitions'))
            .finally(() => commit("updateField", { path: 'status', value: STATUS_LIST.NOTHING }))

        return promise
    },
    LOAD_LIST({ commit, getters }, payload) {
        if (getters.list_loading)
            return

        commit("updateField", { path: 'status_list', value: STATUS_LIST.SAVING })

        const current_limit = payload.limit * payload.page
        const offset = current_limit - payload.limit

        const promise = Competition.findAndCountAll({
            limit: current_limit,
            offset: offset
        })
        
        promise
            .then(result => {
                commit("updateField", { path: 'list_total', value: result.count })
                commit("updateField", { path: 'list', value: result.rows.map(row => row.get({ plain: true })) })
            })
        .catch(() => this.$notify.error('Un problème est survenu lors de la récupération des compétitions'))
        .finally(() => commit("updateField", { path: 'status_list', value: STATUS_LIST.NOTHING }))

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