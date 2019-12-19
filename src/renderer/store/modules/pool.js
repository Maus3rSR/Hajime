import { getField, updateField } from 'vuex-map-fields'
import FightLib from '@root/lib/fight'

const entriableList = ["Fighter", "Team"]
const numberOfFighterPerFightList = [1, 2] 
let entry_list_association_list = []
let fight_list_association_list = []

entriableList.forEach(entriable => { // TODO @see `src\renderer\database\definitions\05_Fight.js`
    entry_list_association_list.push(entriable.toLowerCase())

    numberOfFighterPerFightList.forEach(number =>
        fight_list_association_list.push({
            association: `${entriable.toLowerCase()}${number}`,
            include: entriable === "Team" ? ["fighter_list"] : []
        })
    )
})

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
    has_fight_list: state => state.list.length && state.list[0].fight_list.length,
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
    CREATE({ commit, getters, state, rootGetters, rootState }) {
        if (getters.saving)
            return

        commit("updateField", { path: 'status', value: STATUS_LIST.SAVING })

        state.list.forEach((pool, index) => { // Fight list generation for each pool
            let fight_list = []

            try {
                const fl = new FightLib(pool.entry_list, rootState.configuration.POOL_MIN_NUMBER)
                fight_list = fl.compile()
            } catch (error) {
                commit("updateField", { path: 'status', value: STATUS_LIST.NOTHING })
                return Promise.reject(error)
            }

            commit("updateField", { 
                path: `list[${index}].fight_list`,
                value: fight_list.map(fight => ({
                    entriable1_id: parseInt(fight[0].entriable_id),
                    entriable2_id: parseInt(fight[1].entriable_id),
                    entriable: fight[0].entriable,
                    entry1: fight[0].entry,
                    entry2: fight[1].entry
                }))
            })
        })

        const promise = rootGetters["database/instance"].transaction(t => {
            return rootGetters["database/getModel"]("Pool").bulkCreate(state.list, {
                transaction: t,
                include: ["entry_list", "fight_list"]
            })
        })

        promise
            .then(() => this.$notify.success('Les poules ont bien été sauvegardées')) // There is no update from data here, too complex with the polymorphic relationship, maybe we need some callback onto model to retrieve fighter/team data after save
            .catch(() => this.$notify.error('Un problème est survenu lors de la sauvegarde des poules'))
            .finally(() => commit("updateField", { path: 'status', value: STATUS_LIST.NOTHING }))

        return promise
    },
    SAVE_CONFIGURATION({ commit, getters, rootGetters, state }) {
        if (getters.saving)
            return

        commit("updateField", { path: 'status', value: STATUS_LIST.SAVING })

        const { id, competition_formula_id, ...fields } = state.configuration
        const promise = rootGetters["database/getModel"]("PoolConfiguration").update(fields, { where: { id: parseInt(id, 10) } })

        promise
            .then()
            .catch(() => this.$notify.error('Un problème est survenu lors de la mise à jour de la configuration des poules'))
            .finally(() => commit("updateField", { path: 'status', value: STATUS_LIST.NOTHING }))

        return promise
    },
    LOAD_LIST({ commit, getters, rootGetters, state }) {
        if (getters.list_loading)
            return

        if (getters.is_configuration_empty) {
            const msg = "Impossible de récupérer la liste des poules car la configuration liée à ces poules n'est pas chargée"
            this.$notify.error(msg)
            return Promise.reject(msg)
        }

        commit("updateField", { path: 'status_list', value: STATUS_LIST.LOADING })

        const Pool = rootGetters["database/getModel"]("Pool")

        const promise = Pool.findAndCountAll({
            where: { competition_formula_id: parseInt(state.configuration.competition_formula_id, 10) },
            order: [
                ['number', 'ASC'],
                [Pool.associations.entry_list, 'number', 'ASC'],
                [Pool.associations.fight_list, 'id', 'ASC']
            ],
            include: [{
                association: 'entry_list',
                include: entry_list_association_list
            }, {
                association: 'fight_list',
                include: fight_list_association_list,
            }]
        })

        promise
            .then(result => commit("updateField", { path: 'list', value: result.rows.map(row => row.get({ plain: true })) }))
            .catch(() => this.$notify.error('Un problème est survenu lors de la récupération des poules'))
            .catch(err => console.log(err))
            .finally(() => commit("updateField", { path: 'status_list', value: STATUS_LIST.NOTHING }))

        return promise
    },
    LOAD_CONFIGURATION({ dispatch, commit, getters, rootGetters }, competition_formula_id) {
        if (getters.loading)
            return

        dispatch('CLEAR')
        commit("updateField", { path: 'status', value: STATUS_LIST.LOADING })

        const promise = rootGetters["database/getModel"]("PoolConfiguration").findOne({ where: { competition_formula_id: parseInt(competition_formula_id, 10) } })

        promise
            .then(config => commit('INJECT_CONFIGURATION_DATA', config.get({ plain: true })))
            .catch(() => this.$notify.error('Un problème est survenu lors de la récupération de informations de configuration des poules'))
            .finally(() => commit("updateField", { path: 'status', value: STATUS_LIST.NOTHING }))

        return promise
    },
    GENERATE_PDF({ state, getters }) { // @todo Exporter dans une lib javascript
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