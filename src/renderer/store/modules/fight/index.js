const defaultState = () => ({})
const state = defaultState()
const getters = {}
const mutations = {}

const actions = {
    ADD_FIGHTER_ORDER(context, { fight_id, fighter_id, order }) {

    },
    FIGHTER_ORDER_UP(context, fighter_order) {

    },
    FIGHTER_ORDER_DOWN(context, fighter_order) {
        
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