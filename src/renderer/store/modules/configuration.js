const state = {
    COMPETITION_MINIMUM_ENTRANT: parseInt(process.env.ELECTRON_WEBPACK_APP_COMPETITION_MINIMUM_ENTRANT, 10),
    POOL_MIN_NUMBER: parseInt(process.env.ELECTRON_WEBPACK_APP_POOL_MIN_NUMBER, 10),
    POOL_MIN_SIZE: parseInt(process.env.ELECTRON_WEBPACK_APP_POOL_MIN_SIZE, 10),
    POOL_MAX_SIZE: parseInt(process.env.ELECTRON_WEBPACK_APP_POOL_MAX_SIZE, 10),
    LAST_POOL_OFFSET: parseInt(process.env.ELECTRON_WEBPACK_APP_LAST_POOL_OFFSET, 10), // The last pool can have a difference of X entries maximum (minus or plus)
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