<script>
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import Configuration from './pool/Configuration'
import Viewer from './pool/Viewer'
import FightList from './pool/FightList'

import { setupVueI18nMessages } from '@config/i18n'
import translations from '@lang/screens/software/competition/steps/pool/messages'

export default {
    i18n: setupVueI18nMessages(translations),
    components: { Configuration, Viewer, FightList },
    props: {
        formula_id: {
            type: Number,
            required: true
        },
    },
    computed: {
        ...mapState('configuration', ["COMPETITION_MINIMUM_ENTRANT"]),
        ...mapState('pool', {
            competition_formula_id: state => state.configuration.competition_formula_id,
            is_locked: state => state.configuration.locked
        }),
        ...mapGetters({
            entry_count: "competition/entry_present_count",
            is_loading: "pool/loading",
            is_list_loading: "pool/list_loading",
            is_saving: "pool/saving",
            is_configuration_empty: "pool/is_configuration_empty",
            finished_percentage: "pool/finished_percentage"
        }),
        has_enough_entry() {
            return this.entry_count >= this.COMPETITION_MINIMUM_ENTRANT
        },
        list_validated() {
            return this.is_locked && !this.is_saving
        },
        tab_title() {
            return this.list_validated
                ? this.$t("common.of.list", { item: this.$t("common.pools") })
                : this.$t("common.draw-random")
        },
        fight_list_tab_style() {
            return {
                width: `${this.finished_percentage}%`
            }
        },
        is_completed() {
            return this.finished_percentage === 100;
        }
    },
    methods: {
        ...mapMutations('fight_board', ["LOCK_FIGHT_BOARD", "UNLOCK_FIGHT_BOARD"]),
        ...mapActions({
            loadConfiguration: "pool/LOAD_CONFIGURATION",
            loadList: "pool/LOAD_LIST",
            onFightValidated: "pool/ON_FIGHT_VALIDATED",
            onScoreFightUpdated: "pool/ON_SCORE_FIGHT_UPDATED"
        }),
        onTabShown() {
            this.$softwareContainer.$emit('forceResize')
        }
    },
    data() {
        return {}
    },
    created() {
        if (this.formula_id !== this.competition_formula_id)
            this.loadConfiguration(this.formula_id).then(() => this.loadList(this.formula_id))

        this.$ipc.send('check-fight-board-already-opened')
        this.$ipc.on('fight-board-opened', (e, fight_board_id) => this.LOCK_FIGHT_BOARD(fight_board_id))
        this.$ipc.on('fight-board-closed', (e, fight_board_id) => this.UNLOCK_FIGHT_BOARD(fight_board_id))
        this.$ipc.on('fight-board-score-updated', (e, fight, fighter_up, fighter_down, score_number) => this.onScoreFightUpdated({ fight, fighter_up, fighter_down, score_number }))
        this.$ipc.on('fight-board-validated', (e, fight, fighter1, fighter2) => this.onFightValidated({ fight, fighter1, fighter2 }))
    }
}
</script>

<template>
    <div class="competition__manage__pool">
        <transition name="fade" mode="out-in" appear>
            <div v-if="is_configuration_empty" class="text-center">
                <h1>{{ $t("pool.empty") }} :'(</h1>
            </div>

            <clip-loader v-else-if="is_loading || is_list_loading" :color="'#fff'"></clip-loader>

            <span v-else>
                <transition name="fade" mode="out-in" appear>
                    <div v-if="has_enough_entry">
                        <div class="row">
                            <div class="col-sm-12">
                                <b-tabs @input="onTabShown" pills card vertical>
                                    <b-tab active>
                                        <template slot="title">
                                            {{ tab_title }}
                                        </template>

                                        <configuration v-if="!list_validated" />
                                        <viewer v-else />
                                    </b-tab>
                                    <b-tab :disabled="!is_locked || is_saving">
                                        <template slot="title">
                                            <i v-if="!is_locked" class="zmdi zmdi-block"></i>
                                            <span
                                                class="nav-link__progress"
                                                :class="{'nav-link__progress-finished': is_completed}"
                                                :style="fight_list_tab_style"
                                            >
                                                <i v-if="is_completed" class="zmdi zmdi-check-circle"></i>
                                            </span>

                                            {{ $t("common.fights") }}
                                        </template>

                                        <fight-list v-if="is_locked" />
                                    </b-tab>
                                </b-tabs>
                            </div>
                        </div>

                        <div class="row software__container--offset-element">
                            <div class="col">
                                <slot name="confirmation-section">
                                    <button :disabled="!is_completed" :class="{'btn-outline-success tada': is_completed}" class="btn float-right animated" @click="$emit('onValidate')">
                                        <slot name="validate-button-content">
                                            {{ $t("common.action.step-next") }}
                                            <i class="zmdi zmdi-arrow-right"></i>
                                        </slot>
                                    </button>
                                </slot>

                                <button class="btn btn-link float-right mr-2" @click="$emit('onBack')">
                                    <i class="zmdi zmdi-arrow-left"></i>
                                    {{ $t("common.action.step-previous") }}
                                </button>
                            </div>
                        </div>
                    </div>
                    

                    <div class="h5 text-warning" v-else>
                        <i class="zmdi zmdi-alert-triangle"></i>
                        {{ $t("pool.not-enough") }}
                    </div>
                </transition>
            </span>
        </transition>
    </div>
</template>

<style lang="scss" scoped>
.software__container--offset-element {
    & > .col {
       margin-top: 2.3rem;
    }
}
</style>