import i18n from '@config/i18n'
import translations from '@lang/store/marking_board.json'

i18n.mergeLocaleMessage("gb", translations.gb)
i18n.mergeLocaleMessage("fr", translations.fr)

/**
 * TODO à rendre plus dynamique !
 */
const color_list = [{
    color: "red",
    label: i18n.t("marking-board.red").toUpperCase()
},{
    color: "white",
    label: i18n.t("marking-board.white").toUpperCase()
}]

const state = {}

const getters = {
    color_list: () => color_list
}

const mutations = {}
const actions = {}

export default {
    namespaced: true,
    strict: process.env.NODE_ENV !== 'production',
    state,
    getters,
    mutations,
    actions
}