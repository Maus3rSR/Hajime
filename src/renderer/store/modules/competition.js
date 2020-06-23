import { Sequelize } from '@root/database'
import { getField, updateField } from 'vuex-map-fields'
import { COMPETITION_MODE, LOADER_STATUS } from '@root/constant'

const defaultState = () => ({
    status: LOADER_STATUS.NOTHING,
    status_list: LOADER_STATUS.NOTHING,
    list: [],
    list_total: 0,
    model: {
        id: null,
        choosen_formula_id: null,
        name: null,
        date: null,
        place: null,
        owner: null,
        type: COMPETITION_MODE.INDI,
        team_place_number: parseInt(process.env.ELECTRON_WEBPACK_APP_TEAM_PLACE_NUMBER_MAX, 10),
        locked: false,
        locked_entry_list: false,
        entry_list: [],
        formula_config_list: [],
    }
})

const getEntryListAssociation = competition_type => (competition_type === COMPETITION_MODE.INDI ? "fighter_list" : { association: "team_list", include: "fighter_list" })
const getEntryListAssociationList = () => [ getEntryListAssociation(COMPETITION_MODE.INDI), getEntryListAssociation(COMPETITION_MODE.TEAM) ]

const state = defaultState()

const getters = {
    getField,
    constant_type_list: () => COMPETITION_MODE,
    type_list: () => [ // TODO : in database
        { id: 1, name: "Individuelle", value: COMPETITION_MODE.INDI },
        { id: 2, name: "Equipe", value: COMPETITION_MODE.TEAM }
    ],
    default_type: () => defaultState().type,
    is_empty: state => null === state.model.id,
    loading: state => state.status === LOADER_STATUS.LOADING,
    list_loading: state => state.status_list === LOADER_STATUS.LOADING,
    saving: state => state.status === LOADER_STATUS.SAVING,
    deleting: state => state.status === LOADER_STATUS.DELETING,
    count: state => state.list.length,
    entry_count: state => (state.model.type === COMPETITION_MODE.INDI ? state.model.entry_list.length : state.model.entry_list.reduce((count, entry) => count += entry.fighter_list.length, 0)),
    entry_present_list: state => JSON.parse(JSON.stringify(state.model.entry_list)).filter(entry => {
        if (state.model.type === COMPETITION_MODE.INDI)
            return entry.is_present

        entry.fighter_list = entry.fighter_list.filter(fighter => fighter.is_present)
        return entry.fighter_list.length !== 0
    }),
    entry_missing_list: state => JSON.parse(JSON.stringify(state.model.entry_list)).filter(entry => {
        if (state.model.type === COMPETITION_MODE.INDI)
            return !entry.is_present

        entry.fighter_list = entry.fighter_list.filter(fighter => !fighter.is_present)
        return entry.fighter_list.length !== 0
    }),
    entry_present_count: (state, getters) => {
        if (state.model.type === COMPETITION_MODE.INDI)
            return getters.entry_present_list.length

        return getters.entry_present_list.reduce((count, entry) => count += entry.fighter_list.length, 0)
    },
    entry_missing_count: (state, getters) => {
        if (state.model.type === COMPETITION_MODE.INDI)
            return getters.entry_missing_list.length

        return getters.entry_missing_list.reduce((count, entry) => count += entry.fighter_list.length, 0)
    },
    is_all_entry_present: (state, getters) => getters.entry_count === getters.entry_present_count,
    is_all_entry_missing: (state, getters) => getters.entry_count === getters.entry_missing_count,
    findEntryIndex: state => entry_id => state.model.entry_list.findIndex(entry => parseInt(entry.id, 10) === parseInt(entry_id, 10)),
    findEntryAndFighterIndex: (state, getters) => fighter_id => {
        if (state.model.type === COMPETITION_MODE.INDI)
            return [-1, getters.findEntryIndex(fighter_id)]

        for (let i = 0; i < state.model.entry_list.length; i++)
            for (let j = 0; j < state.model.entry_list[i].fighter_list.length; j++)
                if (parseInt(fighter_id, 10) === parseInt(state.model.entry_list[i].fighter_list[j].id, 10))
                    return [i,j]

        return [-1, -1]
    }, 
    existFighter: (state, getters) => fighter_id => {
        return state.model.type === COMPETITION_MODE.INDI
            ? getters.findEntryIndex(fighter_id) !== -1
            : getters.findEntryAndFighterIndex(fighter_id)[1] !== -1
    },
    findFormulaConfigIndex: state => formula_config => state.model.formula_config_list.findIndex(el => el.name == formula_config.name)
}

const mutations = {
    updateField,
    RESET_STATE(state) {
        Object.assign(state, defaultState())
    },
    INJECT_MODEL_DATA(state, model) {
        Object.assign(state.model, model)
    },
    ADD_FORMULA_CONFIG(state, formula_config) {
        state.model.formula_config_list.push(JSON.parse(JSON.stringify(formula_config)))
    },
    UPDATE_FORMULA_CONFIG(state, { index, formula_config }) {
        state.model.formula_config_list.splice(index, 1, JSON.parse(JSON.stringify(formula_config)))
    },
    ADD_ENTRY(state, entry) {
        state.model.entry_list.push(entry)
    },
    UPDATE_FIGHTER(state, fighter) {
        if (state.model.type === COMPETITION_MODE.TEAM) {
            const [ entry_index, fighter_index ] = getters.findEntryAndFighterIndex(state, getters)(fighter.id)

            if (-1 === fighter_index) {
                state.model.entry_list[getters.findEntryIndex(state)(fighter.team_id)].fighter_list.push(fighter)
                return
            }

            if (parseInt(state.model.entry_list[entry_index].id, 10) !== parseInt(fighter.team_id, 10)) {
                const to_entry_index = getters.findEntryIndex(state)(fighter.team_id)
                state.model.entry_list[entry_index].fighter_list.splice(fighter_index, 1)
                state.model.entry_list[to_entry_index].fighter_list.push(fighter)
                return
            }

            state.model.entry_list[entry_index].fighter_list.splice(fighter_index, 1, fighter)
            return
        }

        const index = getters.findEntryIndex(state)(fighter.id)

        if (index === -1) {
            state.model.entry_list.push(fighter)
            return
        }

        state.model.entry_list.splice(index, 1, fighter)
    },
    REMOVE_FIGHTER(state, id) {
        if (state.model.type === COMPETITION_MODE.TEAM) {
            const [ entry_index, fighter_index ] = getters.findEntryAndFighterIndex(state, getters)(id)

            if (-1 === fighter_index)
                return

            state.model.entry_list[entry_index].fighter_list.splice(fighter_index, 1)
            return
        }

        const index = getters.findEntryIndex(state)(id)

        if (index === -1)
            return

        state.model.entry_list.splice(index, 1)
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
    CREATE({ commit, getters, rootGetters, state }) {
        if (getters.saving)
            return

        commit("updateField", { path: 'status', value: LOADER_STATUS.SAVING })

        const competition = {
            ...state.model,
            ...state.model.type === COMPETITION_MODE.INDI && { fighter_list: state.model.entry_list },
            ...state.model.type === COMPETITION_MODE.TEAM && { team_list: state.model.entry_list }
        }

        const promise = rootGetters["database/instance"].transaction(t => {
            return rootGetters["database/getModel"]("Competition").create(competition, {
                transaction: t,
                include: [
                    getEntryListAssociation(competition.type),
                    { association: 'formula_config_list', include: ['pool_configuration', 'tree_configuration'] }
                ]
            })
        })

        promise
            .then(competition => {
                this.$notify.success("La compétition a bien été sauvegardée")
                commit('INJECT_MODEL_DATA', competition.get({ plain: true }))
            })
            .catch(Sequelize.UniqueConstraintError, () => {
                let team_unique_error_msg = competition.type === COMPETITION_MODE.TEAM ? "ou des équipes en double" : ""
                this.$notify.error(`Impossible de sauvegarder, il y a des combattants en double ${team_unique_error_msg} !`)
            })
            .catch(Sequelize.ValidationError, err => this.$notify.error(err.message))
            .catch(() => this.$notify.error("Un problème est survenu lors de la création de la compétition"))
            .finally(() => commit("updateField", { path: 'status', value: LOADER_STATUS.NOTHING }))

        return promise
    },
    SAVE({ commit, getters, rootGetters, state }) {
        if (getters.saving)
            return

        commit("updateField", { path: 'status', value: LOADER_STATUS.SAVING })

        if (state.model.locked)
        {
            this.$notify.error("Vous n'avez pas le droit de mettre à jour la compétition")
            return Promise.reject()
        }

        const { id, entry_list, formula_config_list, ...fields } = state.model
        const promise = rootGetters["database/getModel"]("Competition").update(fields, { where: { id: parseInt(id, 10) }})

        promise
            .then(() => this.$notify.success('La compétition a bien été mise à jour'))
            .catch(() => this.$notify.error('Un problème est survenu lors de la mise à jour de la compétition'))
            .finally(() => commit("updateField", { path: 'status', value: LOADER_STATUS.NOTHING }))        

        return promise
    },
    LOCK({ commit, getters, rootGetters, state }) {
        if (getters.saving)
            return

        commit("updateField", { path: 'status', value: LOADER_STATUS.SAVING })

        const promise = rootGetters["database/getModel"]("Competition").update({ locked: true }, { where: { id: parseInt(state.model.id, 10) }})

        promise
            .then(() => {
                commit("updateField", { path: 'model.locked', value: true })
                this.$notify.success('La compétition a bien été mise à jour')
            })
            .catch(() => this.$notify.error('Un problème est survenu lors du verrouillage de la compétition'))
            .finally(() => commit("updateField", { path: 'status', value: LOADER_STATUS.NOTHING }))        

        return promise
    },
    SAVE_FIGHTER({ commit, getters, rootGetters, state }, fighter) {
        if (getters.saving)
            return Promise.reject()

        if (getters.is_empty) {
            this.$notify.error("Impossible de procéder à la sauvegarde de ce combattant. Aucune compétition n'est chargée.")
            return Promise.reject()
        }

        if (state.model.locked_entry_list)
        {
            this.$notify.error("Vous n'avez pas le droit de mettre à jour les combattants")
            return Promise.reject()
        }

        const update = undefined !== fighter.id && null !== fighter.id

        if (update && !getters.existFighter(fighter.id)) {
            this.$notify.error("Impossible de procéder à l'édition d'un combattant inexistant")
            return Promise.reject()
        }

        if (!update && state.model.type === COMPETITION_MODE.INDI)
            fighter.competition_id = state.model.id

        commit("updateField", { path: 'status', value: LOADER_STATUS.SAVING })

        let promise
        if (update)
        {
            const { id, ...fields } = fighter
            promise = rootGetters["database/getModel"]("Fighter").update(fields, { where: { id: fighter.id }})
        } else if (state.model.type === COMPETITION_MODE.TEAM && -1 === getters.findEntryIndex(fighter.team_id)) {
            const team_name = fighter.team_id
            delete fighter.team_id
            promise = rootGetters["database/getModel"]("Team").create({ competition_id: state.model.id, name: team_name, fighter_list: [fighter] }, { include: "fighter_list"  })
        } else
            promise = rootGetters["database/getModel"]("Fighter").create(fighter)

        promise
            .then(f => {
                const value = update ? fighter : f.get({ plain: true })
                const mutation_name = !update && !!value.fighter_list ? "ADD_ENTRY" : "UPDATE_FIGHTER"

                commit(mutation_name, value)

                this.$notify.success(`Le combattant a bien été sauvegardé`)
            })
            .catch(() => this.$notify.error('Un problème est survenu lors de la sauvegarde du combattant'))
            .finally(() => commit("updateField", { path: 'status', value: LOADER_STATUS.NOTHING }))

        return promise
    },
    DELETE_FIGHTER({ commit, getters, rootGetters }, fighter_id) {
        if (getters.deleting)
            return

        if (getters.is_empty) {
            this.$notify.error("Impossible de procéder à la suppression de ce combattant. Aucune compétition n'est chargée.")
            return Promise.reject()
        }
        
        if (state.model.locked_entry_list)
        {
            this.$notify.error("Vous n'avez pas le droit de supprimer les combattants")
            return Promise.reject()
        }

        if (!getters.existFighter(fighter_id)) {
            this.$notify.error("Impossible de procéder à la suppression d'un combattant inexistant")
            return Promise.reject()
        }

        commit("updateField", { path: 'status', value: LOADER_STATUS.DELETING })
        const promise = rootGetters["database/getModel"]("Fighter").destroy({ where: { id: fighter_id } })

        promise
            .then(() => {
                commit("REMOVE_FIGHTER", fighter_id)
                this.$notify.success('Le combattant a bien été supprimé')
            })
            .catch(() => this.$notify.error('Un problème est survenu lors de suppression du combattant'))
            .finally(() => commit("updateField", { path: 'status', value: LOADER_STATUS.NOTHING }))

        return promise
    },
    BULK_UPDATE_ENTRY({ commit, getters, rootGetters, state }, { id_list, field_list, is_team_field }) {
        is_team_field = !!is_team_field

        const label = is_team_field ? "équipes" : "combattants"
        const model_name = is_team_field ? "Team" : "Fighter"

        if (getters.saving)
            return

        if (getters.is_empty) {
            this.$notify.error(`Impossible de faire la mise à jour en masse de ces ${label}. Aucune compétition n'est chargée.`)
            return Promise.reject()
        }

        if (state.model.locked_entry_list)
        {
            this.$notify.error(`Vous n'avez pas le droit de mettre à jour les ${label}`)
            return Promise.reject()
        }

        if (!Array.isArray(id_list))
        {
            this.$notify.error(`Les données ne sont pas valides pour cette mise à jour en masse des ${label}`)
            return Promise.reject()
        }

        const { id, competition_id, team_id, created_at, updated_at, ...field_list_to_update } = field_list // extract forbidden fields

        commit("updateField", { path: 'status', value: LOADER_STATUS.SAVING })
        const promise = rootGetters["database/getModel"](model_name).update(field_list_to_update, { where: { id: id_list }})

        promise
            .then(() => {
                id_list.forEach(id => {
                    let path = undefined

                    if (!is_team_field && state.model.type === COMPETITION_MODE.TEAM) {
                        const [ entry_index, fighter_index ] = getters.findEntryAndFighterIndex(id)
                        path = `model.entry_list[${entry_index}].fighter_list[${fighter_index}]`
                    } else
                        path = `model.entry_list[${getters.findEntryIndex(id)}]`

                    Object.keys(field_list_to_update).forEach(field => commit("updateField", { path: `${path}.${field}`, value: field_list_to_update[field]}))
                })

                this.$notify.success('La mise à jour a bien été effectuée')
            })
            .catch(() => this.$notify.error(`Un problème est survenu lors de la mise à jour en masse des ${label}`))
            .finally(() => commit("updateField", { path: 'status', value: LOADER_STATUS.NOTHING }))

        return promise
    },
    LOAD({ dispatch, commit, getters, rootGetters }, id) {
        if (getters.loading)
            return

        dispatch('CLEAR')
        commit("updateField", { path: 'status', value: LOADER_STATUS.LOADING })

        const promise = rootGetters["database/getModel"]("Competition").findByPk(parseInt(id, 10), { include: [...getEntryListAssociationList(), 'formula_config_list'] })
        
        promise
            .then(competition => commit('INJECT_MODEL_DATA', competition.get({ plain: true })))
            .catch(() => this.$notify.error('Un problème est survenu lors de la récupération des compétitions'))
            .finally(() => commit("updateField", { path: 'status', value: LOADER_STATUS.NOTHING }))

        return promise
    },
    LOAD_LIST({ commit, getters, rootGetters }, payload) {
        if (getters.list_loading)
            return

        commit("updateField", { path: 'status_list', value: LOADER_STATUS.SAVING })

        const current_limit = payload.limit * payload.page
        const offset = current_limit - payload.limit

        const promise = rootGetters["database/getModel"]("Competition").findAndCountAll({
            limit: current_limit,
            offset: offset
        })
        
        promise
            .then(result => {
                commit("updateField", { path: 'list_total', value: result.count })
                commit("updateField", { path: 'list', value: result.rows.map(row => row.get({ plain: true })) })
            })
        .catch(() => this.$notify.error('Un problème est survenu lors de la récupération des compétitions'))
        .finally(() => commit("updateField", { path: 'status_list', value: LOADER_STATUS.NOTHING }))

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