
import { getField, updateField } from 'vuex-map-fields'

const STATUS_LIST = {
    NOTHING: "NOTHING",
    SAVING: "SAVING",
    LOADING: "LOADING"
}

const defaultState = () => ({
    status: STATUS_LIST.NOTHING,
    model: {
        id: null,
        competition_id: null,
        number_of_qualified_fighter: 1,
        number_of_pool: 1,
        number_of_entry_per_pool: 1,
        dismiss_favorite: false,
        lock: false,
        pool_list: []
    }
})

const state = defaultState()

const getters = {
    getField,
    is_empty: state => null == state.model.id,
    loading: state => state.status == STATUS_LIST.LOADING,
    saving: state => state.status == STATUS_LIST.SAVING,
    pool_count: state => state.model.pool_list.length,
}

const mutations = {
    updateField,
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
    SAVE_ALL({ dispatch, commit }) { // Save model and pool_list
        commit('STATUS_START', STATUS_LIST.SAVING)
        return new Promise((resolve, reject) => {
            // TODO API SAVE DATA
            setTimeout(() => {
                commit('STATUS_STOP')
                dispatch('NOTIFY_SUCCESS', 'Les poules ont bien été sauvegardées', { root: true })
                resolve()
            }, 1500)
        })
    },
    LOAD({ dispatch, commit }, competition_id) {
        dispatch('CLEAR')
        commit('STATUS_START', STATUS_LIST.LOADING)

        // TODO DEV : Supprimer à terme
        let model = defaultState().model

        return new Promise((resolve, reject) => {
            // TOTO API GET DATA
            setTimeout(() => {
                commit('STATUS_STOP')
                commit('INJECT_MODEL_DATA', model)
                resolve()
            }, 3000)
        })
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
            margin: { right: margingLeftX, left: margingLeftX, top: margingY + autoTableYCompensation, bottom: margingY + autoTableYCompensation},
            head: [[null, "Nom"]],
            body: []
        }

        state.model.pool_list.forEach((pool, index) => { // Each pool
            let body = []
            let is_pair = (index+1) % 2 === 0

            if (!is_pair && index > 0)
                startY = doc.autoTable.previous.finalY + margingBetweenEachPoolLine

            pool.forEach((entry, entry_index) => body.push([(index+1)+"."+(entry_index+1), entry.name])) // Each entry of pool

            config.head[0][0] = "Poule n°"+(index+1)
            config.body = body
            config.startY = startY
            config.margin.right = (is_pair ? margingLeftX : margingLeftSecondTable)
            config.margin.left = (is_pair ? margingLeftSecondTable : margingLeftX)

            doc.autoTable(config)

            const total_page = doc.internal.getNumberOfPages()
            if (current_page < total_page)
            {
                current_page = total_page
                startY = doc.autoTable.previous.pageStartY
            }
        })

        const pageCount = doc.internal.getNumberOfPages()
        for (let i = 0; i < pageCount; i++)
        {
            doc.setPage(i)
            const page_info = doc.internal.getCurrentPageInfo()
            doc.text('Liste des poules ('+getters.pool_count+')', margingLeftX, margingY)
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