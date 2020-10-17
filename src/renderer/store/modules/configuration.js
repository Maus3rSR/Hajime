const state = {
    APP_NAME: process.env.ELECTRON_WEBPACK_APP_NAME,
    COMPETITION_MINIMUM_ENTRANT: parseInt(process.env.ELECTRON_WEBPACK_APP_COMPETITION_MINIMUM_ENTRANT, 10),
    TEAM_PLACE_NUMBER_MIN: parseInt(process.env.ELECTRON_WEBPACK_APP_TEAM_PLACE_NUMBER_MIN, 10),
    TEAM_PLACE_NUMBER_MAX: parseInt(process.env.ELECTRON_WEBPACK_APP_TEAM_PLACE_NUMBER_MAX, 10),
    POOL_MIN_NUMBER: parseInt(process.env.ELECTRON_WEBPACK_APP_POOL_MIN_NUMBER, 10),
    POOL_MIN_SIZE: parseInt(process.env.ELECTRON_WEBPACK_APP_POOL_MIN_SIZE, 10),
    POOL_MAX_SIZE: parseInt(process.env.ELECTRON_WEBPACK_APP_POOL_MAX_SIZE, 10),
    LAST_POOL_OFFSET: parseInt(process.env.ELECTRON_WEBPACK_APP_LAST_POOL_OFFSET, 10), // The last pool can have a difference of X entries maximum (minus or plus)
    FIGHT_LIMIT_SCORE: parseInt(process.env.ELECTRON_WEBPACK_APP_FIGHT_LIMIT_SCORE, 10),
    FIGHT_NB_FOOL_GIVE_IPPON: parseInt(process.env.ELECTRON_WEBPACK_APP_FIGHT_NB_FOOL_GIVE_IPPON, 10),
    FIGHT_FOOL_CODE: process.env.ELECTRON_WEBPACK_APP_FIGHT_FOOL_CODE,
    FIGHT_SCORE_FOOL_CODE: process.env.ELECTRON_WEBPACK_APP_FIGHT_SCORE_FOOL_CODE,
    FIGHT_SCORE_FORFEIT_CODE: process.env.ELECTRON_WEBPACK_APP_FIGHT_SCORE_FORFEIT_CODE,
    FIGHT_SCORE_REACHED_CODE: process.env.ELECTRON_WEBPACK_APP_FIGHT_SCORE_REACHED_CODE
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