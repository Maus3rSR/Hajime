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
    is_empty_fighter2: state => undefined === state.fighter2.id
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
                    }
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
    ADD_SCORE({ dispatch, commit, state, rootGetters }, { fighter_id, score }) {
        fighter_id = parseInt(fighter_id, 10)

        if (parseInt(state.fighter1.id, 10) !== fighter_id || parseInt(state.fighter2.id, 10 !== fighter_id))
            return this.$notify.error("Impossible d'attributer le score. Le combattant n'est pas valide")

        
    },
    REMOVE_SCORE({ dispatch, commit, rootGetters }, { fighter_id, score }) {
        fighter_id = parseInt(fighter_id, 10)

        if (parseInt(state.fighter1.id, 10) !== fighter_id || parseInt(state.fighter2.id, 10 !== fighter_id))
            return this.$notify.error("Impossible de supprimer le score. Le combattant n'est pas valide")
        },
    UPDATE_FOOL_COUNT({ dispatch, commit, rootGetters }, { fighter_id, fool_count }) {
        fighter_id = parseInt(fighter_id, 10)

        if (parseInt(state.fighter1.id, 10) !== fighter_id || parseInt(state.fighter2.id, 10 !== fighter_id))
            return this.$notify.error("Impossible de mettre à jour le nombre de pénalités. Le combattant n'est pas valide")
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