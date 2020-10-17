import { getField, updateField } from 'vuex-map-fields'
import fight from './fight'

import i18n from '@config/i18n'
import commonTranslations from '@lang/generic/common.json'
import translations from '@lang/store/fight_board.json'

i18n.mergeLocaleMessage("gb", commonTranslations.gb)
i18n.mergeLocaleMessage("fr", commonTranslations.fr)
i18n.mergeLocaleMessage("gb", translations.gb)
i18n.mergeLocaleMessage("fr", translations.fr)

const modules = { fight }

const defaultState = () =>  ({
    loading: false,
    saving: false,
    saving_fool: false,
    saved: false,
    locked_board_list: [], // If a fight is in this list, then someone is already managing the fight in another fight board
    fight: {},
    fighter1: {},
    fighter2: {}
})

const state = defaultState()

const getters = {
    getField,
    is_empty_fight: state => undefined === state.fight.id,
    is_empty_fighter1: state => undefined === state.fighter1.id,
    is_empty_fighter2: state => undefined === state.fighter2.id,
    is_team_fight: state => state.fight.entriable === "Team",
    saving: state => state.saving || state.saving_fool,
    isFighterNumber: state => (fighter_id, number) => undefined !== state[`fighter${parseInt(number, 10)}`].id && parseInt(state[`fighter${parseInt(number, 10)}`].id, 10) === parseInt(fighter_id, 10),
    isFightBoardLocked: state => id => state.locked_board_list.indexOf(id) !== -1,
    isOneOfFighter: (state, getters) => fighter_id => getters.isFighterNumber(fighter_id, 1) || getters.isFighterNumber(fighter_id, 2),
    getBoardId: state => (fight_id, fighter1_id, fighter2_id) => `${fight_id}_${fighter1_id}_${fighter2_id}`,
    getFighterNumber: (state, getters) => fighter_id => getters.isFighterNumber(fighter_id, 1) ? 1 : 2,
    getFighterScoreGivenCount: (state, getters) => fighter_id => state[`fighter${parseInt(getters.getFighterNumber(fighter_id))}`].score_given_list.length
}

const mutations = {
    updateField,
    RESET_STATE(state) {
        Object.assign(state, defaultState())
    },
    START_LOADING(state) {
        state.loading = true
    },
    STOP_LOADING(state) {
        state.loading = false
    },
    START_SAVING(state) {
        state.saved = false
        state.saving = true
    },
    STOP_SAVING(state) {
        state.saving = false
    },
    START_SAVING_FOOL(state) {
        state.saved = false
        state.saving_fool = true
    },
    STOP_SAVING_FOOL(state) {
        state.saving_fool = false
    },
    LOCK_FIGHT_BOARD(state, fight_reference) {
        state.locked_board_list.push(fight_reference)
    },
    UNLOCK_FIGHT_BOARD(state, fight_reference) {
        state.locked_board_list.splice(state.locked_board_list.indexOf(fight_reference), 1)
    },
    ADD_SCORE(state, { fighter_number, score }) {
        state[`fighter${parseInt(fighter_number, 10)}`].score_given_list.push(score)
        state.saved = true
    },
    REMOVE_SCORE(state, { fighter_number, score_id }) {
        const index = state[`fighter${parseInt(fighter_number, 10)}`].score_given_list.findIndex(score => parseInt(score.id, 10) === parseInt(score_id, 10))

        if (index === -1)
            return

        state[`fighter${parseInt(fighter_number, 10)}`].score_given_list.splice(index, 1)
        state.saved = true
    },
    UPDATE_FOOL(state, { fighter_number, fool }) {
        state[`fighter${parseInt(fighter_number, 10)}`].fool = Object.assign(state[`fighter${parseInt(fighter_number, 10)}`].fool || {}, fool)
        state.saved = true
    },
    VALIDATED(state, fighter_fight_meta) {
        state.fight.fighter_fight_meta_list.push(fighter_fight_meta)
        state.saved = true
    }
}

const actions = {
    CLEAR({ commit }) {
        commit("RESET_STATE")
    },
    LOAD({ dispatch, commit, state, rootGetters }, { fight_id, fighter1_id, fighter2_id }) {
        if (state.loading)
            return

        const getFight = fight_id => rootGetters["database/getModel"]("Fight").findByPk(parseInt(fight_id, 10), {
            include: [{
                association: "fighter_fight_meta_list",
                required: false,
                include: "comment",
                where: {
                    fighter1_id: parseInt(fighter1_id, 10),
                    fighter2_id: parseInt(fighter2_id, 10)
                }
            }]
        })
        const getFighter = (from_fighter_id, on_fighter_id) => rootGetters["database/getModel"]("Fighter").findByPk(
            parseInt(from_fighter_id, 10), {
                include: [{
                    association: "score_given_list",
                    required: false,
                    where: { 
                        fight_id: parseInt(fight_id, 10),
                        on_fighter_id: parseInt(on_fighter_id, 10), 
                    },
                    include: ["score_type"]
                }, {
                    association: "fool",
                    required: false,
                    where: { fight_id: parseInt(fight_id, 10) }
                }]
            }
        )

        dispatch('CLEAR')
        commit('START_LOADING')

        const promise = Promise.all([
            getFight(fight_id),
            getFighter(fighter1_id, fighter2_id),
            getFighter(fighter2_id, fighter1_id)
        ])

        promise
            .then(([fight, fighter1, fighter2]) => {
                if (null === fight)
                    return this.$notify.error(i18n.t("fightBoard.error.fight.find"))
                else if (null === fighter1 || null === fighter2)
                    return this.$notify.error(i18n.t("fightBoard.error.fighter.find"))

                switch (fight.entriable) {
                    case "Team":
                        if (parseInt(fight.entriable1_id, 10) === parseInt(fighter1.team_id, 10) && parseInt(fight.entriable2_id, 10) === parseInt(fighter2.team_id, 10))
                            break;
                        return this.$notify.error(i18n.t("fightBoard.error.fighter.notBelongTeam"))
                    default:
                        if (parseInt(fight.entriable1_id, 10) === parseInt(fighter1.id, 10) && parseInt(fight.entriable2_id, 10) === parseInt(fighter2.id, 10))
                            break;
                        return this.$notify.error(i18n.t("fightBoard.error.fighter.notBelong"))
                }

                commit("updateField", { path: 'fight', value: fight.get({ plain: true }) })
                commit("updateField", { path: 'fighter1', value: fighter1.get({ plain: true }) })
                commit("updateField", { path: 'fighter2', value: fighter2.get({ plain: true }) })
            })
            .catch(() => this.$notify.error(i18n.t("fightBoard.error.fight.retrieve")))
            .finally(() => commit('STOP_LOADING'))

        return promise
    },
    ADD_SCORE({ dispatch, commit, state, getters, rootGetters }, { from_fighter_id, on_fighter_id, score_type }) {
        if (state.fight.locked)
            return this.$notify.error(i18n.t("common.error.forbiddenAction"))

        if (!getters.isOneOfFighter(from_fighter_id) || !getters.isOneOfFighter(on_fighter_id))
            return this.$notify.error(i18n.t("fightBoard.error.score.attributeValidFighter"))

        if (getters.getFighterScoreGivenCount(from_fighter_id) >= rootGetters["configuration/FIGHT_LIMIT_SCORE"])
            return this.$notify.error(i18n.t("fightBoard.error.score.limit"))

        from_fighter_id = parseInt(from_fighter_id, 10)
        on_fighter_id = parseInt(on_fighter_id, 10)

        commit("START_SAVING")

        const promise = dispatch("fight/ADD_SCORE", { fight_id: parseInt(state.fight.id, 10), from_fighter_id, on_fighter_id, score_type_id: parseInt(score_type.id, 10) })

        promise
            .catch(() => this.$notify.error(i18n.t("fightBoard.error.score.attribute")))
            .then(score => {
                score = score.get({ plain: true })
                score.score_type = score_type

                commit("ADD_SCORE", {
                    fighter_number: getters.getFighterNumber(from_fighter_id),
                    score: score
                })
            })
            .finally(() => commit("STOP_SAVING"))

        return promise
    },
    REMOVE_SCORE({ dispatch, commit, state, getters }, { fighter_id, score_id }) {
        if (state.fight.locked)
            return this.$notify.error(i18n.t("common.error.forbiddenAction"))

        if (!getters.isOneOfFighter(fighter_id))
            return this.$notify.error(i18n.t("fightBoard.error.score.deleteValidFighter"))

        fighter_id = parseInt(fighter_id, 10)

        commit("START_SAVING")

        const promise = dispatch("fight/REMOVE_SCORE", score_id)

        promise
            .then(() => commit("REMOVE_SCORE", { 
                fighter_number: getters.getFighterNumber(fighter_id),
                score_id 
            }))
            .catch(() => this.$notify.error(i18n.t("fightBoard.error.score.delete")))
            .finally(() => commit("STOP_SAVING"))

        return promise
    },
    UPDATE_FOOL_COUNT({ commit, state, getters, rootGetters }, { fighter_id, fool_count }) {
        if (state.fight.locked)
            return this.$notify.error(i18n.t("common.error.forbiddenAction"))

        if (!getters.isOneOfFighter(fighter_id))
            return this.$notify.error(i18n.t("fightBoard.error.penalty.updateValidFighter"))

        fighter_id = parseInt(fighter_id, 10)
        fool_count = parseInt(fool_count, 10)

        if (fool_count > rootGetters["configuration/FIGHT_LIMIT_SCORE"] * rootGetters["configuration/FIGHT_NB_FOOL_GIVE_IPPON"])
            return this.$notify.error(i18n.t("fightBoard.error.penalty.limit"))

        const fight_id = parseInt(state.fight.id, 10)
        const fighter_number = getters.getFighterNumber(fighter_id)
        const fighter_fool = state[`fighter${fighter_number}`].fool
        const create = null === fighter_fool
        let promise

        commit("START_SAVING_FOOL")

        promise = create ? 
            rootGetters["database/getModel"]("Fool").create({ fight_id: fight_id, fighter_id: fighter_id, number: fool_count }) :
            rootGetters["database/getModel"]("Fool").update({ number: fool_count }, { where: { fight_id: fight_id, fighter_id: fighter_id }})

        promise
            .then(f_fool => {
                const count = create ? f_fool.get({ plain: true }) : fighter_fool
                commit("UPDATE_FOOL", { fighter_number, count })
            })
            .catch(() => this.$notify.error(i18n.t("fightBoard.error.penalty.update")))
            .finally(() => commit("STOP_SAVING_FOOL"))

        return promise
    },
    UPDATE_SUDDEN_DEATH({ commit, state, rootGetters }) { // Property is already updated through v-model
        if (state.fight.locked)
            return this.$notify.error(i18n.t("common.error.forbiddenAction"))

        if (undefined === state.fight.id)
            return this.$notify.error(i18n.t("fightBoard.error.penalty.updateValidFighter"))

        commit("START_SAVING")

        const promise = rootGetters["database/getModel"]("Fight").update({ sudden_death: state.fight.sudden_death }, { where: { id: parseInt(state.fight.id, 10) } })

        promise
            .then(() => commit("updateField", { path: 'saved', value: true }))
            .catch(() => this.$notify.error(i18n.t("fightBoard.error.penalty.update")))
            .finally(() => commit("STOP_SAVING"))

        return promise
    },
    VALIDATE({ dispatch, commit, state }, comment) {
        if (state.fight.locked)
            return this.$notify.error(i18n.t("common.error.validated") + " ;-)")

        if (undefined === state.fight.id)
            return this.$notify.error(i18n.t("fightBoard.error.fight.exist"))

        const fight_id = parseInt(state.fight.id, 10)
        const fighter1_id = parseInt(state.fighter1.id, 10)
        const fighter2_id = parseInt(state.fighter2.id, 10)

        commit("START_SAVING")

        const promise = dispatch("fight/LOCK", { fight_id, fighter1_id, fighter2_id, comment })

        promise
            .then(fighter_fight_meta => commit("VALIDATED", fighter_fight_meta.get({ plain: true })))
            .catch(() => this.$notify.error(i18n.t("fightBoard.error.fight.validate")))
            .finally(() => commit("STOP_SAVING"))

        return promise
    }
}

export default {
    namespaced: true,
    strict: process.env.NODE_ENV !== 'production',
    state,
    getters,
    mutations,
    actions,
    modules
}