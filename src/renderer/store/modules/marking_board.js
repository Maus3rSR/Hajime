import { setupVueI18nMessages } from '@config/i18n'
import translations from '@lang/store/board/marking/messages'

const i18n = setupVueI18nMessages(translations)

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