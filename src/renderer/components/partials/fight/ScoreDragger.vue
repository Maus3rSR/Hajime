<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import ScoreDragContainer from './ScoreDragContainer'

const containerReferenceList = ["scoreContainerLeft", "scoreContainerRight"]
const fighterReferenceList = ["fighter_left", "fighter_right"]

export default {
    components: { ScoreDragContainer },
    props: {
        readonly: {
            type: Boolean,
            default: false
        },
        locked: {
            type: Boolean,
            default: false
        },
        fighter_left: {
            type: Object,
            required: true
        },
        fighter_right: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapState("configuration", ["FIGHT_LIMIT_SCORE", "FIGHT_SCORE_FOOL_CODE", "FIGHT_SCORE_FORFEIT_CODE"]),
        ...mapState("score_type", {
            full_score_list: state => state.list,
            score_type_list_loading: state => state.loading
        }),
        ...mapGetters({
            score_type_list_count: "score_type/count",
            score_type_list: "score_type/list_visible",
            getScoreByCode: "score_type/getByCode"
        }),
        is_readonly_or_locked() {
            return this.readonly || this.locked
        },
        can_drag_score() {
            return !this.is_readonly_or_locked && !this.disabled
        },
        is_fight_ikiwake() {
            return this.locked && this.fighter_left_score_given_list.length === this.fighter_right_score_given_list.length
        },
        fool_score() {
            return this.getScoreByCode(this.FIGHT_SCORE_FOOL_CODE)
        },
        forfeit_score() {
            return this.getScoreByCode(this.FIGHT_SCORE_FORFEIT_CODE)
        },
        is_fighter_left_first_score() {
            if (this.fighter_right.score_given_list.length === 0 && this.fighter_left.score_given_list.length > 0)
                return true
            else if (this.fighter_left.score_given_list.length === 0)
                return false

            const left_score_date = this.fighter_left.score_given_list[0].createdAt
            const right_score_date = this.fighter_right.score_given_list[0].createdAt

            return left_score_date < right_score_date
        },
        is_fighter_right_first_score() {
            if (this.fighter_right.score_given_list.length > 0 && this.fighter_left.score_given_list.length === 0)
                return true
            else if (this.fighter_right.score_given_list.length === 0)
                return false

            const left_score_date = this.fighter_left.score_given_list[0].createdAt
            const right_score_date = this.fighter_right.score_given_list[0].createdAt

            return left_score_date > right_score_date
        },
        fighter_left_score_given_list() {
            return this.fighter_left.score_given_list.map(score => score.score_type)
        },
        fighter_right_score_given_list() {
            return this.fighter_right.score_given_list.map(score => score.score_type)
        },
        fighter_left_fool_number() {
            return null === this.fighter_left.fool ? 0 : parseInt(this.fighter_left.fool.number, 10)
        },
        fighter_right_fool_number() {
            return null === this.fighter_right.fool ? 0 : parseInt(this.fighter_right.fool.number, 10)
        },
        fighter_left_crossed() {
            return this.locked && this.fighter_left_score_given_list.length < this.fighter_right_score_given_list.length
        },
        fighter_right_crossed() {
            return this.locked && this.fighter_right_score_given_list.length < this.fighter_left_score_given_list.length
        },
    },
    methods: {
        ...mapActions({
            loadScoreTypeList: "score_type/LOAD_ALL",
        }),
        onMove() { return 1 }, // Avoid swap on 2 elements
        getContainerReference(index) {
            index = parseInt(index, 0)

            if (isNaN(index))
                return undefined

            return containerReferenceList[index]
        },
        getFighterReference(index) {
            index = parseInt(index, 0)

            if (isNaN(index))
                return undefined

            return fighterReferenceList[index]
        },
        getFighterFromContainerIndex(index) {
            return this[this.getFighterReference(index)]
        },
        onScoreReached() {
            this.disabled = true
        },
        onScoreUnreached() {
            this.disabled = false
        },
        onFoolReached(from_container_index) {
            if (this.ignoreNextEvent) {
                this.ignoreNextEvent = false
                return
            }

            this.$refs[this.getContainerReference(1 - from_container_index)].addScore(this.fool_score)
        },
        onFoolUnreached(from_container_index) {
            if (this.ignoreNextEvent) {
                this.ignoreNextEvent = false
                return
            }
            
            this.ignoreNextEvent = true // Avoid multiple event looping issue
            this.$refs[this.getContainerReference(1 - from_container_index)].removeScore(this.fool_score)
        },
        onScoreAdded(score_type, from_container_index) {
            const from_fighter_id = this.getFighterFromContainerIndex(from_container_index).id
            const on_fighter_id = this.getFighterFromContainerIndex(1 - from_container_index).id
            this.$emit('on-score-added', { from_fighter_id, on_fighter_id, score_type })
        },
        onScoreRemoved(score_type, from_container_index) {
            const fighter = this.getFighterFromContainerIndex(from_container_index)
            const score = fighter.score_given_list.find(score => parseInt(score.score_type_id, 10) === parseInt(score_type.id, 10))

            if (undefined === score) {
                this.$notify.error("Score introuvable, impossible de procéder à sa suppression")
                return
            }

            this.$emit('on-score-removed', { fighter_id: fighter.id, score_id: score.id })

            if (this.cleaning)
                return

            if (this.ignoreNextEvent) {
                this.ignoreNextEvent = false
                return
            }

            if (score_type.code !== this.fool_score.code)
                return

            this.ignoreNextEvent = true // Avoid multiple event looping issue
            this.$refs[this.getContainerReference(1 - from_container_index)].removeFool()
        },
        onFoolUpdated(fool_count, from_container_index) {
            const fighter_id = this.getFighterFromContainerIndex(from_container_index).id
            this.$emit('on-fool-updated', { fighter_id, fool_count })
        },
        onFighterForfeit(fighter_id) {
            let index = 0
            let fighter = this.getFighterFromContainerIndex(index)
            if (parseInt(fighter.id, 10) !== parseInt(fighter_id)) {
                index = 1
                fighter = this.getFighterFromContainerIndex(index)
            }

            if (parseInt(fighter.id, 10) !== parseInt(fighter_id))
                return this.$notify.error("Le combattant déclarant forfait n'est pas valide. Impossible de proécéder à la modification des scores")

            this.cleaning = true

            this.$refs[this.getContainerReference(index)].clean()
            this.$refs[this.getContainerReference(1 - index)].clean()
            
            this.cleaning = false

            for (let i = 0; i < 2; i++)
                this.$refs[this.getContainerReference(1 - index)].addScore(this.forfeit_score)
        }
    },
    data() {
        return {
            cleaning: false,
            disabled: false,
            ignoreNextEvent: false, // This is to prevent ping pong $emit issue from container left/right
            score_choosen: false
        }
    },
    created() {
        if (this.score_type_list_count === 0)
            this.loadScoreTypeList()
    }
}
</script>

<template>
    <div class="row fight-versus--content" :class="{ 'ikiwake': is_fight_ikiwake }">
        <!-- LEFT SCORE CONTAINER FOR A FIGHTER -->
        <div class="col">
            <transition name="fade" mode="out-in">
                <score-drag-container
                    v-if="!score_type_list_loading"

                    :class="{ 'crossed': fighter_left_crossed }"
                    :initialScoreList="fighter_left_score_given_list"
                    :initialFoolNumber="fighter_left_fool_number"
                    :limit="FIGHT_LIMIT_SCORE"
                    :scoreChoosen="score_choosen"
                    :canDragScore="can_drag_score"
                    :isLocked="is_readonly_or_locked"
                    :firstScoreRounded="is_fighter_left_first_score"
                    :ref="getContainerReference(0)"

                    @on-fool-reached="onFoolReached(0)"
                    @on-fool-unreached="onFoolUnreached(0)"
                    @on-score-reached="onScoreReached"
                    @on-fool-update="fool_count => onFoolUpdated(fool_count, 0)"
                    @on-score-unreached="onScoreUnreached"
                    @on-score-add="score => onScoreAdded(score, 0)"
                    @on-score-remove="score => onScoreRemoved(score, 0)"
                />
            </transition>
        </div>

        <!-- MIDDLE CONTAINER WITH ALL SCORE -->
        <div class="col-sm-1" v-if="!is_readonly_or_locked">
            <transition name="fade" mode="out-in">
                <span v-if="score_type_list_loading">
                    <clip-loader color="#ffffff"></clip-loader>
                </span>
                <draggable
                    class="card d-flex flex-column align-items-center justify-content-center"
                    
                    v-else

                    :list="score_type_list"
                    :group="{ name: 'score', pull: 'clone', put: false }"
                    :sort="false"
                    :move="onMove"

                    @choose="score_choosen = true"
                    @unchoose="score_choosen = false"
                >
                    <button v-for="(score_type, index) in score_type_list" :key="index" :disabled="disabled" :title="score_type.name" class="btn btn-light btn--icon mb-4">
                        <span v-html="score_type.code"></span> 
                    </button>
                </draggable>
            </transition>
        </div>

        <!-- RIGHT SCORE CONTAINER FOR A FIGHTER -->
        <div class="col">
            <transition name="fade" mode="out-in">
                <score-drag-container
                    v-if="!score_type_list_loading"

                    :class="{ 'crossed': fighter_right_crossed }"
                    :initialScoreList="fighter_right_score_given_list"
                    :initialFoolNumber="fighter_right_fool_number"
                    :limit="FIGHT_LIMIT_SCORE"
                    :scoreChoosen="score_choosen"
                    :canDragScore="can_drag_score"
                    :isLocked="is_readonly_or_locked"
                    :firstScoreRounded="is_fighter_right_first_score"
                    :ref="getContainerReference(1)"

                    @on-fool-reached="onFoolReached(1)"
                    @on-fool-unreached="onFoolUnreached(1)"
                    @on-fool-update="fool_count => onFoolUpdated(fool_count, 1)"
                    @on-score-reached="onScoreReached"
                    @on-score-unreached="onScoreUnreached"
                    @on-score-add="score => onScoreAdded(score, 1)"
                    @on-score-remove="score => onScoreRemoved(score, 1)"
                />
            </transition>
        </div>
    </div>
</template>

<style lang="scss" scoped>
main {
    padding: 30px;
    position: relative;
    height: 100vh;
    background: url('~@images/fight/versus_bg.png') no-repeat center center;
    background-size: cover;
    overflow: hidden;

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

        &:after, &:before {
            content: "";
            position: absolute;
            background-color: #fff;
            width: 0%;
            height: 10px;
            top: calc(50% - 10px);
            left: 0;
            right: 0;
            margin: 0 auto;
            z-index: 1;
            transition: width 2s ease;
        }

        &.ikiwake {
            position: relative;
            overflow: hidden;

            &:after, &:before {
                width: 100%;
            }

            &:after {
                transform: rotate(-25deg);
            }

            &:before {
                transform: rotate(25deg);
            }

            .crossed:after { display: none; }
        }

        .card {
            height: 100%;
        }

        .score-drag-container {
            &:after {
                content: "";
                position: absolute;
                background-color: #fff;
                width: 0%;
                height: 10px;
                top: calc(50% - 10px);
                left: 0;
                right: 0;
                margin: 0 auto;
                z-index: 1;
                transform: rotate(-45deg);
                transition: width 2s ease;
            }

            &.crossed {
                position: relative;
    
                &:after {
                    width: 100%;
                }
            }
        }
    }
}
</style>