<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import ScoreDragger from '@partials/fight/ScoreDragger'
import FightLib from '@root/lib/fight'

import { setupVueI18nMessages } from '@config/i18n'
import translations from '@lang/screens/board/fight/messages'

export default {
    i18n: setupVueI18nMessages(translations),
    components: { ScoreDragger },
    props: {
        fight_id: { required: true },
        fighter1_id: { required: true },
        fighter2_id: { required: true },
    },
    computed: {
        ...mapState('fight_board', ['fight','fighter1','fighter2', 'saved', 'saving_validate']),
        ...mapFields('fight_board', ['fight.sudden_death']),
        ...mapGetters({
            is_empty_fight: "fight_board/is_empty_fight",
            is_empty_fighter1: "fight_board/is_empty_fighter1",
            is_empty_fighter2: "fight_board/is_empty_fighter2",
            is_team_fight: "fight_board/is_team_fight",
            is_saving: "fight_board/saving",
        }),
        modal_title() {
            return this.forfeit
                ? this.$t("fight-board.modal.title.forfeit")
                : this.$t("fight-board.modal.title.validation")
        },
        is_disabled() {
            return this.readonly || (!this.fight.id ? true : this.fightIsLocked(this.fight, this.fighter1, this.fighter2))
        }
    },
    methods: {
        ...mapActions({
            loadFightBoard: "fight_board/LOAD",
            addScore: "fight_board/ADD_SCORE",
            removeScore: "fight_board/REMOVE_SCORE",
            updateFoolCount: "fight_board/UPDATE_FOOL_COUNT",
            updateSuddenDeath: "fight_board/UPDATE_SUDDEN_DEATH",
            validateFight: "fight_board/VALIDATE"
        }),
        showConfirm(forfeit) {
            this.forfeit = forfeit ? true : false
            this.$refs.modalConfirmFight.show()
        },
        confirm() {
            if (this.forfeit && null === this.forfeit_fighter_id)
                return this.$notify.error("Veuillez choisir un combattant qui déclare forfait")
            
            if (null !== this.forfeit_fighter_id)
                this.$refs.scoreComponent.onFighterForfeit(this.forfeit_fighter_id)

            this.validateFight(this.comment)
                .then(() => this.$ipc.send('fight-board-validated', this.fight, this.fighter1, this.fighter2))
        },
        fightIsLocked(fight, fighter1, fighter2) {
            return FightLib.isLocked(fight, fighter1, fighter2)
        }
    },
    watch: {
        'fighter1.score_given_list': {
            handler(score_given_list) { // old value don't work for Object/Array
                if (undefined === score_given_list || this.old_score_number.fighter1 === -1) return

                const score_diff = score_given_list.length - this.old_score_number.fighter1
                this.$ipc.send('fight-board-score-updated', this.fight, this.fighter1, this.fighter2, score_diff)

                this.old_score_number.fighter1 = score_given_list.length
            },
            immediate: false
        },
        'fighter2.score_given_list': {
            handler(score_given_list) { // old value don't work for Object/Array
                if (undefined === score_given_list || this.old_score_number.fighter2 === -1) return

                const score_diff = score_given_list.length - this.old_score_number.fighter2
                this.$ipc.send('fight-board-score-updated', this.fight, this.fighter2, this.fighter1, score_diff)

                this.old_score_number.fighter2 = score_given_list.length
            },
            immediate: false
        },
    },
    data() {
        return {
            readonly: false,
            marking_board_reversed: false,
            forfeit: false,
            forfeit_fighter_id: null,
            comment: null,
            old_score_number: { fighter1: -1, fighter2: -1 }
        }
    },
    created() {
        if (this.fight_id !== this.fight.id)
            this.loadFightBoard({
                fight_id: this.fight_id,
                fighter1_id: this.fighter1_id,
                fighter2_id: this.fighter2_id
            })
                .then(() => {
                    this.old_score_number.fighter1 = this.fighter1.score_given_list.length
                    this.old_score_number.fighter2 = this.fighter2.score_given_list.length
                })

        this.marking_board_reversed = undefined !== this.$route.query.marking_board_reversed ? true : false
        this.readonly = undefined !== this.$route.query.readonly ? true : false
    }
}
</script>

<template>
    <main class="fight-versus" :class="{ 'reversed': marking_board_reversed }">
        <section class="card animated fadeIn">
            <div class="card-body">
                <div class="row fight-versus--title mb-4">
                    <div class="col text-right">
                        <empty-placeholder :loaded="!is_empty_fighter1" :width="'100%'" class="h2 animated fadeInLeftBig">
                            {{ fighter1.name }}
                        </empty-placeholder>
                    </div>
                    <div class="col-sm-1 text-center">
                        <div class="h1 versus animated heartBeat">VS</div>
                    </div>
                    <div class="col">
                        <empty-placeholder :loaded="!is_empty_fighter2" :width="'100%'" class="h2 animated fadeInRightBig">
                            {{ fighter2.name }}
                        </empty-placeholder>
                    </div>
                </div>

                <score-dragger
                    v-if="!is_empty_fighter1 && !is_empty_fighter2"

                    ref="scoreComponent"

                    @on-score-added="addScore"
                    @on-score-removed="removeScore"
                    @on-fool-updated="updateFoolCount"

                    :locked="fightIsLocked(fight, fighter1, fighter2)"
                    :readonly="readonly"
                    :fighter_left="fighter1"
                    :fighter_right="fighter2"
                />

                <div class="row fight-versus-footer mt-3">
                    <div class="col-sm-3" v-if="!is_team_fight">
                        <label class="ml-2 custom-control custom-checkbox">
                            <input class="custom-control-input" v-model="sudden_death" type="checkbox" :disabled="is_disabled" @change="updateSuddenDeath">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description">{{ $t("fight-board.deathmatch") }} (Enshõ)</span>
                        </label>
                    </div>

                    <div class="col text-center">
                        <div v-if="is_saving" class="animated fadeInUp faster h4">
                            <clip-loader color="#ffffff" :size="'14px'" /> {{ $t("fight-board.saving") }}
                        </div>
                        <div v-else-if="saved" class="text-success animated fadeOutDown delay-3s h4">
                            <i class="zmdi zmdi-check animated flash"></i> {{ $t("fight-board.saved") }}
                        </div>
                    </div>

                    <div class="col text-right">
                        <transition name="fade" mode="out-in">
                            <span v-if="!is_disabled">
                                <button class="btn btn-link" @click.prevent="showConfirm(true)">
                                    {{ $t("fight-board.action.forfeit") }}
                                    <i class="zmdi zmdi-close"></i>
                                </button>
                                <button class="btn btn-outline-success" @click.prevent="showConfirm()">
                                    {{ $t("common.action.validate") }}
                                    <i class="zmdi zmdi-check"></i>
                                </button>
                            </span>
                            <span v-else>
                                <i class="zmdi zmdi-lock"></i>
                                {{ $t("common.readonly") }}
                            </span>
                        </transition>

                    </div>
                </div>
            </div>
        </section>

        <modal-confirmation
            ref="modalConfirmFight"
            :title="modal_title"
            :header="false"

            @on-confirm="confirm"
        >
            <template slot="content">

                <div class="row">
                    <div class="col-sm-12 mb-3" v-if="forfeit">
                        <span class="card-body__title">{{ $t("common.fighter") }}</span>
                        <div class="clearfix mt-3">
                            <label class="custom-control custom-radio" v-for="fighter in [fighter1, fighter2]" :key="fighter.id">
                                <input type="radio" name="fighter__forfeit" class="custom-control-input" :value="fighter.id" v-model="forfeit_fighter_id">
                                <span class="custom-control-indicator"></span>
                                <span class="custom-control-description">{{ fighter.name }}</span>
                            </label>
                            <i class="form-group__bar"></i>
                        </div>
                    </div>
                    
                    <div class="col-sm-12">
                        <label for="fight__comment" class="card-body__title">{{ $t("fight-board.modal.comment") }}</label>
                        <div class="form-group">
                            <textarea id="fight__comment" class="form-control" cols="30" rows="10" v-model="comment"></textarea>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-12 text-warning h5">
                        {{ $t("fight-board.modal.warning") }}
                    </div>
                </div>

            </template>
        </modal-confirmation>
    </main>
</template>

<style lang="scss" scoped>
main {
    padding: 30px;
    position: relative;
    height: 100vh;
    background: url('~@images/fight/versus_bg.png') no-repeat center center;
    background-size: cover;
    overflow: hidden;

    &.reversed {
        background-image: url('~@images/fight/versus_bg_reversed.png')
    }

    &:before, &:after {
        content: "";
        display: block;
        position: absolute;
        z-index: 1;
        background: transparent no-repeat;
        background-size: 75vw;
        height: 100vh;
        width: 60vw;
        bottom: 0;

        animation-duration: 1s;
        animation-fill-mode: both;
        animation-delay: 1s;
    }

    &:before {
        left: 0;
        background-image: url('~@images/fight/kenshi_left.png');
        background-position: -15vw 30vh;
        animation-name: fadeInLeft;
    }

    &:after {
        right: 0;
        background-image: url('~@images/fight/kenshi_right.png');
        background-position: 2vw 25vh;
        animation-name: fadeInRight;
    }

    section {
        position: relative;
        z-index: 2;
        height: calc(100vh - 30px * 2);

        &.animated {
            animation-delay: 2s;
        }
    }

    .fight-versus--title {
        .h2.animated {
            animation-delay: 2.5s;
        }
        .versus.animated {
            animation-delay: 3.5s;
        }
    }

    .fight-versus--content {
        height: 80%;

        .card {
            height: 100%;
        }
    }

    .v-spinner {
        display: inline;
    }
}
</style>