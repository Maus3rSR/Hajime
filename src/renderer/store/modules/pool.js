import { Sequelize, sequelize, mapModels } from '@root/database'
import { getField, updateField } from 'vuex-map-fields'

// IMPORT MODELS
const { PoolConfiguration, Pool, PoolEntry, Fighter, Team } =
    mapModels(["PoolConfiguration", "Pool", "PoolEntry", "Fighter", "Team"])
// DEFINES RELATIONSHIP
const PoolEntryList = Pool.hasMany(PoolEntry, { as: 'entry_list', foreignKey: 'pool_id' })
PoolEntryList.Fighter = PoolEntry.belongsTo(Fighter, {
    foreignKey: 'entriable_id',
    constraints: false,
    as: 'fighter'
})
PoolEntryList.Team = PoolEntry.belongsTo(Team, {
    foreignKey: 'entriable_id',
    constraints: false,
    as: 'team'
})
PoolEntryList.Team.FighterList = Team.hasMany(Fighter, { as: 'fighter_list', foreignKey: 'team_id' })

const STATUS_LIST = {
    NOTHING: "NOTHING",
    SAVING: "SAVING",
    LOADING: "LOADING"
}

const defaultState = () => ({
    status: STATUS_LIST.NOTHING,
    status_list: STATUS_LIST.NOTHING,
    list: [],
    configuration: {
        id: null,
        competition_formula_id: null,
        number_of_qualified_fighter: 1,
        number_of_pool: 1,
        number_of_entry_per_pool: 1,
        dismiss_favorite: false,
        lock: false,
    }
})

const state = defaultState()

const getters = {
    getField,
    is_configuration_empty: state => null === state.configuration.id,
    loading: state => state.status === STATUS_LIST.LOADING,
    list_loading: state => state.status_list === STATUS_LIST.LOADING,
    saving: state => state.status === STATUS_LIST.SAVING,
    count: state => state.list.length,
    entry_field: state => state.list.length === 0 ? "entry" : (null === state.list[0].fighter ? "team" : "fighter")
}

const mutations = {
    updateField,
    RESET_STATE(state) {
        Object.assign(state, defaultState())
    },
    INJECT_CONFIGURATION_DATA(state, config) {
        Object.assign(state.configuration, config)
    }
}

const actions = {
    CLEAR({ commit }) {
        commit("RESET_STATE")
    },
    CREATE({ dispatch, commit, getters, state }) {
        if (getters.saving)
            return

        commit("updateField", { path: 'status', value: STATUS_LIST.SAVING })

        const promise = sequelize.transaction(t => {
            return Pool.bulkCreate(state.list, {
                transaction: t,
                include: [{
                    association: PoolEntryList,
                    as: 'entry_list'
                }]
            })
        })

        promise
            .then(() => this.$notify.success('Les poules ont bien été sauvegardées')) // TODO there is no update from data, too complex with the polymorphic relationship, maybe we need some callback onto model to retrieve fighter/team data after save
            .catch(() => this.$notify.error('Un problème est survenu lors de la sauvegarde des poules'))
            .finally(() => commit("updateField", { path: 'status', value: STATUS_LIST.NOTHING }))

        return promise
    },
    SAVE_CONFIGURATION({ dispatch, commit, getters, state }) {
        if (getters.saving)
            return

        commit("updateField", { path: 'status', value: STATUS_LIST.SAVING })

        const { id, competition_formula_id, ...fields } = state.configuration
        const promise = PoolConfiguration.update(fields, { where: { id: parseInt(id, 10) } })

        promise
            .then(() => this.$notify.success('La configuration des poules a bien été mise à jour'))
            .catch(() => this.$notify.error('Un problème est survenu lors de la mise à jour de la configuration des poules'))
            .finally(() => commit("updateField", { path: 'status', value: STATUS_LIST.NOTHING }))

        return promise
    },
    LOAD_LIST({ dispatch, commit, getters, state }) {
        if (getters.list_loading)
            return

        if (getters.is_configuration_empty) {
            const msg = "Impossible de récupérer la liste des poules car la configuration liée à ces poules n'est pas chargée"
            this.$notify.error(msg)
            return Promise.reject(msg)
        }

        commit("updateField", { path: 'status_list', value: STATUS_LIST.SAVING })

        const promise = Pool.findAndCountAll({
            where: { competition_formula_id: parseInt(state.configuration.competition_formula_id, 10) },
            order: [
                ['number', 'ASC'],
                [PoolEntryList, 'number', 'ASC']
            ],
            include: [{
                association: PoolEntryList,
                as: 'entry_list',
                include: [{
                    association: PoolEntryList.Fighter,
                    as: 'fighter'
                }, {
                    association: PoolEntryList.Team,
                    as: 'team',
                    include: [{
                        association: PoolEntryList.Team.FighterList,
                        as: 'fighter_list'
                    }]
                }]
            }]
        })

        promise
            .then(result => commit("updateField", { path: 'list', value: result.rows.map(row => row.get({ plain: true })) }))
            .catch(() => this.$notify.error('Un problème est survenu lors de la récupération des poules'))
            .finally(() => commit("updateField", { path: 'status_list', value: STATUS_LIST.NOTHING }))

        return promise
    },
    LOAD_CONFIGURATION({ dispatch, commit, getters }, competition_formula_id) {
        if (getters.loading)
            return

        dispatch('CLEAR')
        commit("updateField", { path: 'status', value: STATUS_LIST.LOADING })

        const promise = PoolConfiguration.findOne({ where: { competition_formula_id: parseInt(competition_formula_id, 10) } })

        promise
            .then(config => commit('INJECT_CONFIGURATION_DATA', config.get({ plain: true })))
            .catch(() => this.$notify.error('Un problème est survenu lors de la récupération de informations de configuration des poules'))
            .finally(() => commit("updateField", { path: 'status', value: STATUS_LIST.NOTHING }))

        return promise
    },
    GENERATE_PDF({ state, getters }) {
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

        state.list.forEach((pool, index) => { // Each pool
            let body = []
            let is_pair = (index + 1) % 2 === 0

            if (!is_pair && index > 0)
                startY = doc.autoTable.previous.finalY + margingBetweenEachPoolLine

            pool.entry_list.forEach(entry => body.push([pool.number + "." + entry.number, entry[getters.entry_field].name])) // Each entry of pool

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
    actions
}