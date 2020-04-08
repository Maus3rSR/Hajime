import Vue from 'vue'
import { getField, updateField } from 'vuex-map-fields'
import { COMPETITION_MODE, LOADER_STATUS, POOL_SCORING, SCORE_DATABASE_FIELD_LIST } from '@root/constant'
import { getEntryListAssociation, getFightListAssociationList, getFightAssociationList } from './pool/association_helper'
import FightLib from '@root/lib/fight'
import fight from './fight'

const modules = { fight }

const defaultState = () => ({
    status: LOADER_STATUS.NOTHING,
    status_list: LOADER_STATUS.NOTHING,
    list: [],
    configuration: {
        id: null,
        competition_formula_id: null,
        number_of_qualified_fighter: 1,
        number_of_pool: 1,
        number_of_entry_per_pool: 1,
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
    team_place_number: state => !!state.configuration.competition_formula && !!state.configuration.competition_formula.competition ? state.configuration.competition_formula.competition.team_place_number : null,
    is_team_mode: state => !!state.configuration.competition_formula && !!state.configuration.competition_formula.competition && state.configuration.competition_formula.competition.type === COMPETITION_MODE.TEAM,
    ranked_list: state => {
        return JSON.parse(JSON.stringify(state.list)).map(pool => {
            let rank_list = []

            pool.entry_list = pool.entry_list.sort((fighter1, fighter2) => {
                if (fighter1.ranking_score > fighter2.ranking_score) return -1
                else if (fighter1.ranking_score < fighter2.ranking_score) return 1
                return 0
            })

            pool.entry_list.forEach(entry => { if (-1 === rank_list.indexOf(entry.ranking_score)) rank_list.push(entry.ranking_score) })
            pool.entry_list.map(entry => {
                entry.rank_number = rank_list.indexOf(entry.ranking_score) + 1
                return entry
            })

            return pool
        })
    },
    finished_percentage: (state, getters) => {
        const total_finished = state.list.reduce((total, pool) => total + getters.getTotalFightListFinishedOfPool(pool.id), 0)
        const total = state.list.reduce((total, pool) => total + getters.getTotalFightList(pool.id), 0)

        return Math.round(total_finished / total * 100 * 10) / 10
    },
    has_fight_list: state => state.list.length > 0 && state.list[0].fight_list !== undefined,
    existPool: (state, getters) => pool_id => getters.findPoolIndex(pool_id) !== -1,
    findPoolIndex: state => pool_id => state.list.findIndex(el => parseInt(el.id, 10) === parseInt(pool_id, 10)),
    findFightIndex: state => (pool_index, fight_id) => state.list[pool_index].fight_list.findIndex(el => parseInt(el.id, 10) === parseInt(fight_id, 10)),
    getTotalFightList: (state, getters) => pool_id => {
        const index = getters.findPoolIndex(pool_id)
        return index === -1 ? 0 : (undefined === state.list[index].fight_list ? 0 : state.list[index].fight_list.length)
    },
    getTotalFightListFinishedOfPool: (state, getters) => pool_id => {
        const index = getters.findPoolIndex(pool_id)
        return index === -1 ? 0 : (undefined === state.list[index].fight_list ? 0 : state.list[index].fight_list.filter(f => undefined !== f.is_locked && f.is_locked).length)
    },
    getTotalFightFinishedPercentageOfPool: (state, getters) => pool_id => Math.round(getters.getTotalFightListFinishedOfPool(pool_id) / getters.getTotalFightList(pool_id) * 100 * 10) / 10
}

const mutations = {
    updateField,
    RESET_STATE(state) {
        Object.assign(state, defaultState())
    },
    SET_CONFIGURATION(state, config) {
        Vue.set(state, 'configuration', config) // No reactivity issue here when using Object.assign...
    },
    UPDATE_POOL_ENTRY(state, pool_entry) {
        const pool_index = getters.findPoolIndex(state)(pool_entry.pool_id)
        if (pool_index === -1) return
        
        const pool_entry_index = state.list[pool_index].entry_list.findIndex(entry => parseInt(entry.id, 10) === parseInt(pool_entry.id, 10))
        if (pool_entry_index === -1) return

        state.list[pool_index].entry_list.splice(pool_entry_index, 1, pool_entry)
    },
    MERGE_FIGHT(state, fight) {
        const pool_id = fight.fightable_id
        const pool_index = getters.findPoolIndex(state)(pool_id)

        if (-1 === pool_index) return

        const pool = state.list[pool_index]
        const fight_index = pool.fight_list.findIndex(f => parseInt(f.id, 10) === parseInt(fight.id, 10))

        if (fight_index === -1)
            state.list[pool_index].fight_list.push(fight)
        else
            state.list[pool_index].fight_list.splice(fight_index, 1, { ...state.list[pool_index].fight_list[fight_index], ...fight })
    }
}

const actions = {
    CLEAR({ commit }) {
        commit("RESET_STATE")
    },
    CREATE({ dispatch, commit, getters, state, rootGetters, rootState }) {
        if (getters.saving)
            return

        if (!state.configuration.competition_formula_id) {
            this.$notify.error("Impossible de créer les poules, l'identifiant de la formule de compétition n'est pas disponible dans la configuration des poules")
            return Promise.reject()
        }

        commit("updateField", { path: 'status', value: LOADER_STATUS.SAVING })

        state.list.forEach((pool, index) => { // Fight list generation for each pool
            let fight_list = []

            try {
                const fl = new FightLib(pool.entry_list, rootState.configuration.POOL_MIN_NUMBER)
                fight_list = fl.compile()
            } catch (error) {
                commit("updateField", { path: 'status', value: LOADER_STATUS.NOTHING })
                return Promise.reject(error)
            }

            commit("updateField", { path: `list[${index}].competition_formula_id`, value: parseInt(state.configuration.competition_formula_id, 10) })
            commit("updateField", {
                path: `list[${index}].fight_list`,
                value: fight_list.map(fight => {
                    const entriable = fight[0].entriable
                    const fight1 = fight[0]
                    const fight2 = fight[1]

                    return {
                        entriable1_id: parseInt(fight1.entriable_id),
                        entriable2_id: parseInt(fight2.entriable_id),
                        entriable,
                        entry1: fight1.entry,
                        entry2: fight2.entry,
                        ...entriable === "Team" && {
                            fight_fighter_order_list1: fight1.entry.fighter_list.map((fighter, index) => ({ fighter_id: parseInt(fighter.id, 10), order: index })),
                            fight_fighter_order_list2: fight2.entry.fighter_list.map((fighter, index) => ({ fighter_id: parseInt(fighter.id, 10), order: index }))
                        }
                    }
                })
            })

        })

        const promise = rootGetters["database/instance"].transaction(t => {
            return rootGetters["database/getModel"]("Pool").bulkCreate(state.list, {
                transaction: t,
                include: ["entry_list", { association: "fight_list", include: ["fight_fighter_order_list1", "fight_fighter_order_list2"] }]
            })
        })

        promise
            .then(() => {
                this.$notify.success('Les poules ont bien été sauvegardées')
                return dispatch("LOAD_LIST")
                    .then(() => {
                        commit("updateField", { path: 'configuration.locked', value: true })
                        return dispatch("SAVE_CONFIGURATION")
                    })
                    .catch(() => {
                        commit("updateField", { path: 'configuration.locked', value: false })
                        dispatch("SAVE_CONFIGURATION")
                        throw new Error()
                    })
            })
            .catch(() => this.$notify.error('Un problème est survenu lors de la sauvegarde des poules'))
            .finally(() => commit("updateField", { path: 'status', value: LOADER_STATUS.NOTHING }))

        return promise
    },
    REVERSE_MARKING_BOARD({ commit, getters, rootGetters, state }, pool_id) {
        // if (getters.saving)
        //     return

        // commit("updateField", { path: 'status', value: LOADER_STATUS.SAVING }) // TODO We encounter btab component reset when we update status....

        const pool_index = getters.findPoolIndex(parseInt(pool_id, 10))

        if (pool_index === -1) {
            this.$notify.error("La poule n'existe pas, impossible de procéder à l'inversion")
            return Promise.reject()
        }

        const pool = state.list[pool_index]
        const fields = { marking_board_reversed: !pool.marking_board_reversed }
        const promise = rootGetters["database/getModel"]("Pool").update(fields, { where: { id: parseInt(pool.id, 10) } })

        promise
            .then(() => {
                this.$notify.success("L'inversion du tableau de marque a bien été effectuée")

                commit("updateField", {
                    path: `list[${pool_index}].marking_board_reversed`,
                    value: fields.marking_board_reversed
                })
            })
            .catch(() => this.$notify.error("Un problème est survenu lors de l'inversion du tableau de marque"))
            // .finally(() => commit("updateField", { path: 'status', value: LOADER_STATUS.NOTHING }))

        return promise
    },
    SAVE_CONFIGURATION({ commit, getters, rootGetters, state }) {
        if (getters.saving)
            return

        commit("updateField", { path: 'status', value: LOADER_STATUS.SAVING })

        const { id, competition_formula_id, ...fields } = state.configuration
        const promise = rootGetters["database/getModel"]("PoolConfiguration").update(fields, { where: { id: parseInt(id, 10) } })

        promise
            .then()
            .catch(() => this.$notify.error('Un problème est survenu lors de la mise à jour de la configuration des poules'))
            .finally(() => commit("updateField", { path: 'status', value: LOADER_STATUS.NOTHING }))

        return promise
    },
    LOAD_CONFIGURATION({ dispatch, commit, getters, rootGetters }, competition_formula_id) {
        if (getters.loading)
            return

        dispatch('CLEAR')
        commit("updateField", { path: 'status', value: LOADER_STATUS.LOADING })

        const promise = rootGetters["database/getModel"]("PoolConfiguration").findOne({ 
            where: { competition_formula_id: parseInt(competition_formula_id, 10) },
            include: [{
                association: "competition_formula",
                attributes: ["competition_id"],
                include: [{
                    association: "competition",
                    attributes: ["type", "team_place_number"]
                }]
            }]
        })

        promise
            .then(config => commit('SET_CONFIGURATION', config.get({ plain: true })))
            .catch(() => this.$notify.error('Un problème est survenu lors de la récupération de informations de configuration des poules'))
            .finally(() => commit("updateField", { path: 'status', value: LOADER_STATUS.NOTHING }))

        return promise
    },
    LOAD_LIST({ commit, getters, rootGetters, state }) {
        if (getters.list_loading)
            return

        if (getters.is_configuration_empty) {
            this.$notify.error("Impossible de récupérer la liste des poules car la configuration liée à ces poules n'est pas chargée")
            return Promise.reject()
        }

        commit("updateField", { path: 'status_list', value: LOADER_STATUS.LOADING })

        const Pool = rootGetters["database/getModel"]("Pool")

        const promise = Pool.findAll({
            where: { competition_formula_id: parseInt(state.configuration.competition_formula_id, 10) },
            order: [
                ['number', 'ASC'],
                [Pool.associations.entry_list, 'number', 'ASC'],
                [Pool.associations.fight_list, 'id', 'ASC']
            ],
            include: [{
                association: 'entry_list',
                include: getEntryListAssociation(
                    rootGetters["competition/constant_type_list"],
                    state.configuration.competition_formula.competition.type
                )
            }, {
                association: 'fight_list',
                include: getFightListAssociationList(
                    rootGetters["database/instance"],
                    rootGetters["competition/constant_type_list"],
                    state.configuration.competition_formula.competition.type
                )
            }]
        })

        promise
            .then(list => commit("updateField", { path: 'list', value: list.map(row => row.get({ plain: true })) }))
            .catch(err => console.log(err))
            .catch(() => this.$notify.error('Un problème est survenu lors de la récupération des poules'))
            .finally(() => commit("updateField", { path: 'status_list', value: LOADER_STATUS.NOTHING }))

        return promise
    },
    LOAD_POOL_ENTRY({ commit, rootGetters }, { pool_id, fighter }) {
        if (!getters.existPool(pool_id)) {
            this.$notify.error("Impossible de récupérer l'entrée de poule")
            return Promise.reject()
        }

        const promise = rootGetters["database/getModel"]("PoolEntry").findOne({
            where : {
                pool_id: parseInt(pool_id, 10) ,
                entriable_id: (null === fighter.team_id ? parseInt(fighter.id, 10) : parseInt(fighter.team_id, 10)),
                entriable: (null === fighter.team_id ? "Fighter" : "Team")
            },
            include: entry_list_association_list
        })

        promise
            .then(pool_entry => {
                if (null === pool_entry) return Promise.reject()
                commit("UPDATE_POOL_ENTRY", pool_entry.get({ plain: true }))
            })
            .catch(() => this.$notify.error("Impossible de récupérer l'entrée de poule"))

        return promise
    },
    LOAD_FIGHT({ commit, rootGetters }, fight_id) {

        const promise = rootGetters["database/getModel"]("Fight").findByPk(fight_id, { 
            include: getFightAssociationList(
                rootGetters["competition/constant_type_list"],
                fight_id,
                state.configuration.competition_formula.competition.type
            ),
            where: { fightable: 'Pool' }
        })

        promise
            .then(fight => {
                if (null === fight) return Promise.reject()
                commit("MERGE_FIGHT", fight.get({ plain: true }))
            })
            .catch(() => this.$notify.error("Impossible de récupérer le combat"))

        return promise
    },
    ADD_FIGHT({ dispatch, getters, rootGetters }, { entry_left, entry_right }) {
        if (undefined === entry_left.pool_id || !getters.existPool(entry_left.pool_id) || undefined === entry_right.pool_id || !getters.existPool(entry_right.pool_id)) {
            this.$notify.error("Impossible de procéder à l'ajout du combat, la poule n'existe pas")
            return Promise.reject()
        }
        
        if (entry_left.pool_id !== entry_right.pool_id) {
            this.$notify.error("Impossible de procéder à l'ajout du combat, les entrées n'appartiennent pas à la même poule")
            return Promise.reject()
        }

        const pool_id = parseInt(entry_left.pool_id, 10)
        const entriable = entry_left.entriable

        const promise = rootGetters["database/getModel"]("Fight").create({
            fightable_id: pool_id,
            fightable: "Pool",
            entriable1_id: parseInt(entry_left.entriable_id, 10),
            entriable2_id: parseInt(entry_right.entriable_id, 10),
            entriable,
            added_manually: true
        })

        promise
            .then(fight => {
                this.$notify.success("Le combat a bien été ajouté à la poule")
                return dispatch("LOAD_FIGHT", parseInt(fight.id))
            })
            .catch(() => this.$notify.error("Une erreur est survenue lors de l'ajout du nouveau combat"))

        return promise
    },
    UPDATE_POOL_ENTRY_SCORE_NUMBER({ dispatch, getters, rootGetters }, { fight, fighter, score_number, field }) {
        const pool_id = parseInt(fight.fightable_id, 10)

        if (fight.fightable !== "Pool" || !getters.existPool(pool_id) || !SCORE_DATABASE_FIELD_LIST.includes(field)) {
            this.$notify.error("Impossible de procéder à la mise à jour des données de poules, la poule n'existe pas")
            return Promise.reject()
        }

        const update_field_list = { [field]: rootGetters["database/instance"].literal(`${field} + ${parseInt(score_number, 10)}`) }
        const promise = rootGetters["database/getModel"]("PoolEntry").update(update_field_list, { 
            where: { 
                pool_id,
                entriable_id: (null === fighter.team_id ? parseInt(fighter.id, 10) : parseInt(fighter.team_id, 10)),
                entriable: (null === fighter.team_id ? "Fighter" : "Team")
            }
        })

        promise
            .then(() => Promise.all([
                dispatch("LOAD_POOL_ENTRY", { pool_id, fighter }),
                dispatch("LOAD_FIGHT", parseInt(fight.id))
            ]))
            .catch(() => this.$notify.error("Impossible de mettre à jour l'entrée de la poule avec les données du combattant"))

        return promise
    },
    UPDATE_POOL_ENTRY_RANKING({ dispatch, getters, rootGetters }, { fight, fighter, pool_scoring }) {
        const pool_id = fight.fightable_id

        if (!getters.existPool(pool_id)) {
            this.$notify.error("Impossible de procéder à la mise à jour des données de poules, la poule n'existe pas")
            return Promise.reject()
        }

        const victory_number_increment_value = pool_scoring === POOL_SCORING.WINNER ? 1 : 0

        const promise = rootGetters["database/getModel"]("PoolEntry").update({
            ...!fight.added_manually && { score: rootGetters["database/instance"].literal(`score + ${parseInt(pool_scoring, 10)}`) },
            victory_number: rootGetters["database/instance"].literal(`victory_number + ${parseInt(victory_number_increment_value, 10)}`),
        }, { 
            where: { 
                pool_id: parseInt(pool_id, 10) ,
                entriable_id: (null === fighter.team_id ? parseInt(fighter.id, 10) : parseInt(fighter.team_id, 10)),
                entriable: (null === fighter.team_id ? "Fighter" : "Team")
            }
        })

        promise
            .then(() => dispatch("LOAD_POOL_ENTRY", { pool_id, fighter }))
            .catch(() => this.$notify.error("Impossible de mettre à jour l'entrée de la poule avec les données du combattant"))

        return promise
    },
    ON_FIGHT_VALIDATED({ dispatch, commit, getters }, { fight, fighter1, fighter2 }) {
        if (undefined === fight.is_locked || undefined === fighter1.score_given_list || undefined === fighter2.score_given_list) {
            this.$notify.error("Impossible de mettre à jour les données de poules en temps réel avec les données provenant du tableau de gestion de match")
            return Promise.reject()
        }

        const pool_id = parseInt(fight.fightable_id, 10)

        if (!getters.existPool(pool_id)) {
            this.$notify.error("Impossible de procéder à la mise à jour des données de poules, la poule n'existe pas")
            return Promise.reject()
        }

        let promise

        if (undefined === fight.is_locked || !fight.is_locked)
            promise = Promise.resolve()
        else if (fighter1.score_given_list.length > fighter2.score_given_list.length)
            promise = Promise.all([
                dispatch('UPDATE_POOL_ENTRY_RANKING', { fight, fighter: fighter1, pool_scoring: POOL_SCORING.WINNER }),
                dispatch('UPDATE_POOL_ENTRY_RANKING', { fight, fighter: fighter2, pool_scoring: POOL_SCORING.LOOSER })
            ])
        else if (fighter2.score_given_list.length > fighter1.score_given_list.length)
            promise = Promise.all([
                dispatch('UPDATE_POOL_ENTRY_RANKING', { fight, fighter: fighter1, pool_scoring: POOL_SCORING.LOOSER }),
                dispatch('UPDATE_POOL_ENTRY_RANKING', { fight, fighter: fighter2, pool_scoring: POOL_SCORING.WINNER })
            ])
        else
            promise = Promise.all([
                dispatch('UPDATE_POOL_ENTRY_RANKING', { fight, fighter: fighter1, pool_scoring: POOL_SCORING.DRAW }),
                dispatch('UPDATE_POOL_ENTRY_RANKING', { fight, fighter: fighter2, pool_scoring: POOL_SCORING.DRAW })
            ])

        promise
            .then(() => commit("MERGE_FIGHT", fight))

        return promise
    },
    ON_SCORE_FIGHT_UPDATED({ dispatch, commit, getters }, { fight, fighter_up, fighter_down, score_number }) {
        const pool_id = parseInt(fight.fightable_id, 10)

        if (!getters.existPool(pool_id)) {
            this.$notify.error("Impossible de procéder à la mise à jour des données de poules, la poule n'existe pas")
            return Promise.reject()
        }

        const promise = Promise.all([
            dispatch('UPDATE_POOL_ENTRY_SCORE_NUMBER', { fight, fighter: fighter_up, score_number, field: 'score_given_number' }),
            dispatch('UPDATE_POOL_ENTRY_SCORE_NUMBER', { fight, fighter: fighter_down, score_number, field: 'score_received_number' })
        ])

        promise
            .then(() => commit("MERGE_FIGHT", fight))

        return promise
    },
    ON_FIGHTER_ORDER_UPDATED({ getters, commit }, { pool_id, fighter_order, fighter_order_replaced }) {
        const pool_index = getters.findPoolIndex(pool_id)

        if (-1 === pool_index)
            return Promise.reject()
            
        const fight_index = getters.findFightIndex(pool_index, fighter_order.fight_id)

        if (-1 === fight_index)
            return Promise.reject()

        const fight = state.list[pool_index].fight_list[fight_index]

        commit("fight/UPDATE_FIGHTER_ORDER", { fight, fighter_order })
        if (!!fighter_order_replaced)
            commit("fight/UPDATE_FIGHTER_ORDER", { fight, fighter_order: fighter_order_replaced })
    },
    ON_FIGHTER_ORDER_UP({ dispatch }, { pool_id, fight_id, fighter, current_order }) {
        return dispatch("fight/FIGHTER_ORDER_UP", { fight_id, fighter, current_order }).then(result => dispatch("ON_FIGHTER_ORDER_UPDATED", { pool_id, ...result }))
    },
    ON_FIGHTER_ORDER_DOWN({ dispatch }, { pool_id, fight_id, fighter, current_order }) {
        return dispatch("fight/FIGHTER_ORDER_DOWN", { fight_id, fighter, current_order }).then(result => dispatch("ON_FIGHTER_ORDER_UPDATED", { pool_id, ...result }))
    },
    GENERATE_PDF({ getters }) { // @todo Exporter dans une lib javascript
        let doc = this.$pdf.getNewDocument()

        const margingLeftX = 15
        const margingRightX = doc.internal.pageSize.width - margingLeftX
        const margingY = 15
        const autoTableYCompensation = 5
        const margingBetweenEachPoolLine = 10
        const marginBetweenEachPool = 20
        const tableWidth = doc.internal.pageSize.width / 2 - marginBetweenEachPool
        const margingLeftSecondTable = margingRightX - tableWidth

        let startY = 20
        let current_page = doc.internal.getNumberOfPages()
        let config = {
            pageBreak: 'avoid',
            showHead: 'firstPage',
            tableWidth: tableWidth,
            startY: startY,
            margin: { right: margingLeftX, left: margingLeftX, top: margingY + autoTableYCompensation, bottom: margingY + autoTableYCompensation },
            head: [[null, "Nom"]],
            body: []
        }

        getters.ranked_list.forEach((pool, index) => { // Each pool
            let body = []
            let is_pair = (index + 1) % 2 === 0

            if (!is_pair && index > 0)
                startY = doc.autoTable.previous.finalY + margingBetweenEachPoolLine

            pool.entry_list.forEach(pool_entry => body.push([pool.number + "." + pool_entry.number, pool_entry.entry.name])) // Each entry of pool

            config.head[0][0] = "Poule n°" + (index + 1)
            config.body = body
            config.startY = startY
            config.margin.right = (is_pair ? margingLeftX : margingLeftSecondTable)
            config.margin.left = (is_pair ? margingLeftSecondTable : margingLeftX)

            doc.autoTable(config)

            const total_page = doc.internal.getNumberOfPages()
            if (current_page < total_page) {
                current_page = total_page
                startY = doc.autoTable.previous.pageStartY
            }
        })

        const pageCount = doc.internal.getNumberOfPages()
        for (let i = 0; i < pageCount; i++) {
            doc.setPage(i)
            const page_info = doc.internal.getCurrentPageInfo()
            doc.text('Liste des poules (' + getters.count + ')', margingLeftX, margingY)
            doc.setFontSize(10)
            doc.text(margingRightX, margingY, page_info.pageNumber + "/" + pageCount)
            doc.setFontSize(14)
        }

        this.$pdf.open(doc)
    }
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