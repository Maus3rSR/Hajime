<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import FightList from '@partials/list/fight_list/Component'

export default {
    components: { FightList },
    computed: {
        ...mapState('pool', ["list"]),
        ...mapGetters({
            color_list: "marking_board/color_list",
            has_fight_list: "pool/has_fight_list",
            is_team_mode: "pool/is_team_mode",
            team_place_number: "pool/team_place_number",
            get_pool_finished_fight_list_percent: "pool/getTotalFightFinishedPercentageOfPool"
        })
    },
    methods: {
        ...mapActions({
            reverseMarkingBoard: "pool/REVERSE_MARKING_BOARD",
            addFight: "pool/ADD_FIGHT",
            validateFightWithOneFighter: "pool/VALIDATE_FIGHT_WITH_ONE_FIGHTER",
            onFighterOrderUp: "pool/ON_FIGHTER_ORDER_UP",
            onFighterOrderDown: "pool/ON_FIGHTER_ORDER_DOWN",
            onFighterOrderAdd: "pool/ON_FIGHTER_ORDER_ADD",
        }),
        onTabShown() {
            this.$softwareContainer.$emit('forceResize')
        },
        getPoolTabStyle(pool_id) {
            return {
                width: `${this.get_pool_finished_fight_list_percent(pool_id)}%`
            }
        },
        isPoolFinished(pool_id) {
            return this.get_pool_finished_fight_list_percent(pool_id) === 100;
        },
        openNewFightModal(pool) {
            this.new_fight = {
                entry_left: pool.entry_list[0],
                entry_right: pool.entry_list[1],
                pool_entry_list: pool.entry_list,
                marking_board_left: this.color_list[+pool.marking_board_reversed],
                marking_board_right: this.color_list[1 - pool.marking_board_reversed],
            }

            this.$refs.modalAddFight.show()
        },
        validateNotValidFight(pool_id, fight_row) {
            this.validateFightWithOneFighter({ pool_id, fight_id: fight_row.id, fighter1: fight_row.fighter1, fighter2: fight_row.fighter2 })
        }
    },
    data() {
        return {
            new_fight: null
        }
    },
}
</script>

<template>
    <div class="competition__manage__pool__fight_list">
        <transition name="fade" mode="out-in">
            <div v-if="!has_fight_list" class="text-center">
                <h1>Aucune données de match... :'(</h1>
            </div>

            <div v-else>
                <b-tabs @input="onTabShown" pills card vertical>
                    <b-tab v-for="(pool, index) in list" :key="index" :active="index === 0">
                        <template slot="title">
                            <span
                                class="nav-link__progress"
                                :class="{'nav-link__progress-finished': isPoolFinished(pool.id)}"
                                :style="getPoolTabStyle(pool.id)"
                            >
                                <i v-if="isPoolFinished(pool.id)" class="zmdi zmdi-check-circle"></i>
                            </span>
                            
                            Poule n°{{ pool.number }}
                        </template>
                        
                        <fight-list
                            :list="pool.fight_list"
                            :index="pool.number"
                            :title="`Matchs de la poule N°${pool.number}`"
                            :marking_board_reversed="pool.marking_board_reversed"
                            :is_team_mode="is_team_mode"
                            :team_place_number="team_place_number"
                            
                            @on-reverse-board="reverseMarkingBoard(pool.id)"
                            @on-fighter-order-up="args => onFighterOrderUp({ pool_id: pool.id, ...args })"
                            @on-fighter-order-down="args => onFighterOrderDown({ pool_id: pool.id, ...args })"
                            @on-fighter-order-add="args => onFighterOrderAdd({ pool_id: pool.id, ...args })"
                        >

                            <template slot="not_valid_and_locked_fight_status">{{ "à valider" | uppercase }}</template>
                            <template slot="not_valid_and_locked_fight_action" slot-scope="props">
                                <button class="btn btn-sm btn-outline-success" title="Procéder à la validation de ce match pour attribuer les points" @click.prevent="validateNotValidFight(pool.id, props.row)">
                                    <i class="zmdi zmdi-check"></i>
                                </button>
                            </template>

                            <template slot="footer">
                                <button class="btn btn-link btn-lg btn__add-fight" @click.prevent="openNewFightModal(pool)">
                                    <i class="zmdi zmdi-plus"></i>
                                    Ajouter un match supplémentaire
                                </button>
                            </template>

                        </fight-list>
                    </b-tab>
                </b-tabs>
            </div>
        </transition>

        <modal-confirmation
            ref="modalAddFight"
            title="Ajout d'un combat supplémentaire"
            :header="false"

            @on-confirm="addFight(new_fight)"
        >
            <template slot="content" v-if="null !== new_fight">

                <div class="row">
                    <div class="col-md-6">
                        <label class="card-body__title">
                            Entrée
                            <span :class="`marking_board__color marking_board__color--${new_fight.marking_board_left.color}`">{{ new_fight.marking_board_left.label }}</span>
                        </label>
                        <select class="form-control" v-model="new_fight.entry_left">
                            <option v-for="pool_entry in new_fight.pool_entry_list" :value="pool_entry" :key="pool_entry.id" :disabled="pool_entry.id === new_fight.entry_right.id">
                                {{ pool_entry.entry.name }}
                            </option>
                        </select>
                    </div>

                    <div class="col-md-6">
                        <label class="card-body__title">
                            Entrée
                            <span :class="`marking_board__color marking_board__color--${new_fight.marking_board_right.color}`">{{ new_fight.marking_board_right.label }}</span>
                        </label>
                        <select class="form-control" v-model="new_fight.entry_right">
                            <option v-for="pool_entry in new_fight.pool_entry_list" :value="pool_entry" :key="pool_entry.id" :disabled="pool_entry.id === new_fight.entry_left.id">
                                {{ pool_entry.entry.name }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="text-info mt-4">
                    <i class="zmdi zmdi-info-outline"></i> Un match ajouté manuellement n'influera pas le nombre de point dans le classement
                </div>

            </template>
        </modal-confirmation>

    </div>
</template>

<style lang="scss">
.competition__manage__pool__fight_list {
    .nav-pills {
        max-height: 61vh;
        overflow: auto;
        flex-wrap: nowrap;
    }
}
</style>