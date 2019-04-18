const state = {
    COMPETITION_MINIMUM_ENTRANT: parseInt(process.env.ELECTRON_WEBPACK_APP_COMPETITION_MINIMUM_ENTRANT, 10),
    POOL_MIN_SIZE: parseInt(process.env.ELECTRON_WEBPACK_APP_POOL_MIN_SIZE, 10),
    POOL_MAX_SIZE: parseInt(process.env.ELECTRON_WEBPACK_APP_POOL_MAX_SIZE, 10),
}

const getters = {}
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