import { setupVueI18nMessages } from '@config/i18n'
import translations from '@lang/store/formula/messages'

const i18n = setupVueI18nMessages(translations)

const state = {
    loading: false,
    list: []
}

const getters = {
    count: state => state.list.length,
    getFormula: state => id => state.list.find(el => el.id == id),
    getFormulaComponentList: (state, getters) => id => {
        const formula = getters.getFormula(id)
        return undefined == formula ? [] : formula.component_list
    }
}

const mutations = {
    START_LOADING(state) {
        state.loading = true
    },
    STOP_LOADING(state) {
        state.loading = false
    },
    SET_LIST(state, list) {
        if (!Array.isArray(list))
            return
        state.list = list
    }
}

const actions = {
    LOAD_ALL({ commit, rootGetters }) {
        let promise = rootGetters["database/getModel"]("Formula").findAll({ raw: true })

        promise
            .then(formula_list => commit("SET_LIST", formula_list))
            .catch(() => this.$notify.error(i18n.t("formula.error.get")))
            .finally(() => commit("STOP_LOADING"))

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