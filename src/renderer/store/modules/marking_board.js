import i18n from '@config/i18n'
import translations from '@lang/store/marking_board.json'

i18n.mergeLocaleMessage("gb", translations.gb)
i18n.mergeLocaleMessage("fr", translations.fr)

const state = {}

const getters = {
    color_list: () => {
        return [{
            color: "red",
            label: i18n.t("markingBoard.red").toUpperCase()
        },{
            color: "white",
            label: i18n.t("markingBoard.white").toUpperCase()
        }]
    }
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