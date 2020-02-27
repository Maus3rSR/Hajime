import { updateField } from 'vuex-map-fields'

const defaultState = () =>  ({
    loading: false,
    fight: {},
    fighter1: {},
    fighter2: {}
})

const state = defaultState()

const getters = {
    is_empty_fight: state => undefined === state.fight.id,
    is_empty_fighter1: state => undefined === state.fighter1.id,
    is_empty_fighter2: state => undefined === state.fighter2.id,
    isFighterNumber: state => (fighter_id, number) => undefined !== state[`fighter${parseInt(number, 10)}`].id && parseInt(state[`fighter${parseInt(number, 10)}`].id, 10) === parseInt(fighter_id, 10),
    isOneOfFighter: (state, getters) => fighter_id => getters.isFighterNumber(fighter_id, 1) || getters.isFighterNumber(fighter_id, 2),
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
    ADD_SCORE(state, { fighter_number, score }) {
        state[`fighter${parseInt(fighter_number, 10)}`].score_given_list.push(score)
    },
    REMOVE_SCORE(state, { fighter_number, score_id }) {
        const index = state[`fighter${parseInt(fighter_number, 10)}`].score_given_list.findIndex(score => parseInt(score.id, 10) === parseInt(score_id, 10))

        if (index === -1)
            return

        state[`fighter${parseInt(fighter_number, 10)}`].score_given_list.splice(index, 1)
    },
    UPDATE_FOOL(state, { fighter_number, fool }) {
        state[`fighter${parseInt(fighter_number, 10)}`].fool = Object.assign(state[`fighter${parseInt(fighter_number, 10)}`].fool || {}, fool)
    }
}

const actions = {
    CLEAR({ commit }) {
        commit("RESET_STATE")
    },
    LOAD({ dispatch, commit, state, rootGetters }, { fight_id, fighter1_id, fighter2_id }) {
        if (state.loading)
            return

        const getFight = fight_id => rootGetters["database/getModel"]("Fight").findByPk(parseInt(fight_id, 10))
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
                    return this.$notify.error("Impossible de trouver les informations de combat")
                else if (null === fighter1 || null === fighter2)
                    return this.$notify.error("Impossible de trouver les informations de tous les combattants")

                switch (fight.entriable) {
                    case "Team":
                        if (parseInt(fight.entriable1_id, 10) === parseInt(fighter1.team_id, 10) && parseInt(fight.entriable2_id, 10) === parseInt(fighter2.team_id, 10))
                            break;
                        return this.$notify.error("Un des combattants (ou les deux) est eronné et ne fait pas partie d'une des équipes de ce combat")
                    default:
                        if (parseInt(fight.entriable1_id, 10) === parseInt(fighter1.id, 10) && parseInt(fight.entriable2_id, 10) === parseInt(fighter2.id, 10))
                            break;
                        return this.$notify.error("Un des combattants (ou les deux) est eronné et ne fait pas partie de ce combat")
                }

                commit("updateField", { path: 'fight', value: fight.get({ plain: true }) })
                commit("updateField", { path: 'fighter1', value: fighter1.get({ plain: true }) })
                commit("updateField", { path: 'fighter2', value: fighter2.get({ plain: true }) })
            })
            .catch(() => this.$notify.error("Erreur lors de la récupération des informations du combat"))
            .finally(() => commit('STOP_LOADING'))

        return promise
    },
    ADD_SCORE({ commit, state, getters, rootGetters }, { from_fighter_id, on_fighter_id, score_type }) {
        if (!getters.isOneOfFighter(from_fighter_id) || !getters.isOneOfFighter(on_fighter_id))
            return this.$notify.error("Impossible d'attributer le score. Le combattant n'est pas valide")

        if (getters.getFighterScoreGivenCount(from_fighter_id) >= rootGetters["configuration/FIGHT_LIMIT_SCORE"])
            return this.$notify.error("La limite d'attribution de score a déjà été atteinte")

        from_fighter_id = parseInt(from_fighter_id, 10)
        on_fighter_id = parseInt(on_fighter_id, 10)

        const promise = rootGetters["database/getModel"]("Score").create({
            fight_id: parseInt(state.fight.id, 10),
            from_fighter_id: from_fighter_id,
            on_fighter_id: on_fighter_id,
            score_type_id: parseInt(score_type.id, 10)
        })

        promise
            .catch(() => this.$notify.error("Un problème est survenu lors de l'attribution du score"))
            .then(score => {
                score = score.get({ plain: true })
                score.score_type = score_type

                commit("ADD_SCORE", {
                    fighter_number: getters.getFighterNumber(from_fighter_id),
                    score: score
                })
            })

        return promise
    },
    REMOVE_SCORE({ commit, getters, rootGetters }, { fighter_id, score_id }) {
        if (!getters.isOneOfFighter(fighter_id))
            return this.$notify.error("Impossible de supprimer le score. Le combattant n'est pas valide")

        fighter_id = parseInt(fighter_id, 10)

        const promise = rootGetters["database/getModel"]("Score").destroy({ where: { id: parseInt(score_id, 10) } })

        promise
            .then(() => commit("REMOVE_SCORE", { 
                fighter_number: getters.getFighterNumber(fighter_id),
                score_id 
            }))
            .catch(() => this.$notify.error('Un problème est survenu lors de suppression du score'))

        return promise
    },
    UPDATE_FOOL_COUNT({ commit, state, getters, rootGetters }, { fighter_id, fool_count }) {
        if (!getters.isOneOfFighter(fighter_id))
            return this.$notify.error("Impossible de mettre à jour le nombre de pénalités. Le combattant n'est pas valide")

        fighter_id = parseInt(fighter_id, 10)
        fool_count = parseInt(fool_count, 10)

        if (fool_count > rootGetters["configuration/FIGHT_LIMIT_SCORE"] * rootGetters["configuration/FIGHT_NB_FOOL_GIVE_IPPON"])
            return this.$notify.error("La limite d'attribution de pénalité a déjà été atteinte")

        const fight_id = parseInt(state.fight.id, 10)
        const fighter_number = getters.getFighterNumber(fighter_id)
        const fighter_fool = state[`fighter${fighter_number}`].fool
        const create = null === fighter_fool
        let promise

        if (create)
            promise = rootGetters["database/getModel"]("Fool").create({ fight_id: fight_id, fighter_id: fighter_id, number: fool_count })
        else
            promise = rootGetters["database/getModel"]("Fool").update({ number: fool_count }, { where: { fight_id: fight_id, fighter_id: fighter_id }})

        promise
            .then(f_fool => {
                const count = create ? f_fool.get({ plain: true }) : fighter_fool
                commit("UPDATE_FOOL", { fighter_number, count })
            })
            .catch(() => this.$notify.error('Un problème est survenu lors de la mise à jour des pénalités'))
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