import { setupVueI18nMessages } from '@config/i18n'
import translations from '@lang/store/modules/fight/messages'

const i18n = setupVueI18nMessages(translations)

const defaultState = () => ({})
const state = defaultState()
const getters = {}

const mutations = {
    UPDATE_FIGHTER_ORDER(state, { fight, fighter_order }) {
        const fighter_id = parseInt(fighter_order.fighter_id, 10)

        let fighter = fight.entry1.fighter_list.find(f => parseInt(f.id, 10) === fighter_id)
        
        if (!fighter)
            fighter = fight.entry2.fighter_list.find(f => parseInt(f.id, 10) === fighter_id)

        if (!fighter) return

        const fo_index = fighter.fight_order_list.findIndex(fo => parseInt(fo.id, 10) === parseInt(fighter_order.id, 10))

        if (-1 === fo_index) {
            fighter.fight_order_list.push(fighter_order)    
            return
        }

        fighter.fight_order_list.splice(fo_index, 1, fighter_order)
    }
}

const actions = {
    LOCK({ rootGetters }, { fight_id, fighter1_id, fighter2_id, comment }) {
        return rootGetters["database/instance"].transaction(t => {
            return rootGetters["database/getModel"]("FighterFightMeta").create({
                fight_id,
                fighter1_id,
                fighter2_id,
                locked: true,
                ...!!comment && {comment: {
                    commentable_id: parseInt(fight_id, 10),
                    commentable: "FighterFightMeta",
                    text: comment
                }}
            }, {
                transaction: t,
                include: "comment"
            })
        })
    },
    ADD_SCORE({ rootGetters }, { fight_id, from_fighter_id, on_fighter_id, score_type_id }) {
        on_fighter_id = on_fighter_id || null
        return rootGetters["database/getModel"]("Score").create({ fight_id, from_fighter_id, on_fighter_id, score_type_id })
    },
    REMOVE_SCORE({ rootGetters }, score_id) {
        return rootGetters["database/getModel"]("Score").destroy({ where: { id: parseInt(score_id, 10) } })
    },
    FIGHTER_ORDER_CHANGE({ rootGetters }, { fight_id, fighter, current_order, new_order }) {
        fighter = JSON.parse(JSON.stringify(fighter))

        const current_fighter_order = !fighter.fight_order_list ? undefined : fighter.fight_order_list.find(fo => parseInt(fo.order, 10) === parseInt(current_order, 10))
        const team_id = parseInt(fighter.team_id, 10)
        const fightFighterModel = rootGetters["database/getModel"]("FightFighterOrder")

        if (!current_fighter_order) {
            this.$notify.error(i18n.t("fight.error.order.update"))
            return Promise.reject()
        }

        return new Promise((resolve, reject) => {
            let fighter_order_to_replace

            fightFighterModel.findOne({
                where: { fight_id: parseInt(fight_id, 10), order: parseInt(new_order, 10) },
                include: { association: "fighter", attributes: [], where: { team_id } }
            })
                .then(fighter_order => fighter_order_to_replace = fighter_order)
                .finally(() => {
                    let other_instance_update_promise = Promise.resolve()

                    if (!!fighter_order_to_replace) {
                        fighter_order_to_replace.order = current_order
                        other_instance_update_promise = fighter_order_to_replace.save()
                    }

                    other_instance_update_promise
                        .then(() => {
                            current_fighter_order.order = new_order

                            return fightFighterModel
                                .update({ order: new_order }, { where: { id: parseInt(current_fighter_order.id, 10) } })
                                .then(() => {
                                    this.$notify.success(i18n.t("fight.success.order.update"))
                                    resolve({
                                        fighter_order: current_fighter_order,
                                        fighter_order_replaced: !!fighter_order_to_replace ? fighter_order_to_replace.get({ plain: true }) : undefined
                                    })
                                })
                                .catch(() => {
                                    this.$notify.error(i18n.t("fight.error.order.updateReplace"))
                                    reject()
                                })
                        })
                        .catch(Sequelize.UniqueConstraintError, () => {
                            this.$notify.error(i18n.t("fight.error.order.updateSame"))
                            reject()
                        })
                        .catch(() => {
                            this.$notify.error(i18n.t("fight.error.order.updateReplace"))
                            reject()
                        })
                })
        })
    },
    FIGHTER_ORDER_ADD({ rootGetters }, { fight_id, fighter, order }) {
        fighter = JSON.parse(JSON.stringify(fighter))
        const team_id = parseInt(fighter.team_id, 10)
        const fightFighterModel = rootGetters["database/getModel"]("FightFighterOrder")

        return new Promise((resolve, reject) => {

            fightFighterModel.count({
                where: { fight_id: parseInt(fight_id, 10), order: parseInt(order, 10) },
                include: { association: "fighter", attributes: [], where: { team_id } }
            })
                .then(count => {
                    if (count > 0) {
                        this.$notify.error(i18n.t("fight.error.order.addAlreadyExist"))
                        return reject()
                    }

                    return fightFighterModel.create({ fight_id, fighter_id: fighter.id, order })
                        .then(fighter_order => resolve(fighter_order.get({ plain: true })))
                        .catch(() => {
                            this.$notify.error(i18n.t("fight.error.order.add"))
                            reject()
                        })
                })
                .catch(() => {
                    this.$notify.error(i18n.t("fight.error.order.verifyBeforeCreate"))
                    reject()
                })
        })
    },
    FIGHTER_ORDER_UP({ dispatch }, { fight_id, fighter, current_order }) {
        const new_order = parseInt(current_order, 10) - 1
        return dispatch("FIGHTER_ORDER_CHANGE", { fight_id, fighter, current_order, new_order })
    },
    FIGHTER_ORDER_DOWN({ dispatch }, { fight_id, fighter, current_order }) {
        const new_order = parseInt(current_order, 10) + 1
        return dispatch("FIGHTER_ORDER_CHANGE", { fight_id, fighter, current_order, new_order })
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