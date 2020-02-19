<script>
import { mapState } from 'vuex'
import ScoreDragContainer from './ScoreDragContainer'

const containerList = ["scoreContainerLeft", "scoreContainerRight"]

export default {
    components: { ScoreDragContainer },
    props: {
        readonly: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapState("configuration", ["FIGHT_LIMIT_SCORE"]),
        full_score_list() {
            return this.score_type_list.concat(this.score_type_hidden_list)
        },
        is_disabled() {
            return this.readonly || this.disabled
        },
        fool_score() {
            return this.getScoreByCode('I')
        }
    },
    methods: {
        onMove() { return 1 }, // Avoid swap on 2 elements
        getScoreByCode(code) {
            return this.full_score_list.find(score => score.code === code)
        },
        getContainerReference(container_index) {
            container_index = parseInt(container_index, 0)

            if (isNaN(container_index))
                return undefined

            return containerList[container_index]
        },
        onScoreReached() {
            this.disabled = true
        },
        onScoreUnreached() {
            this.disabled = false
        },
        onFoolReached(to_container_index) {
            if (this.ignoreNextEvent) {
                this.ignoreNextEvent = false
                return
            }

            this.$refs[this.getContainerReference(to_container_index)].addScore(this.fool_score)
        },
        onFoolUnreached(to_container_index) {
            if (this.ignoreNextEvent) {
                this.ignoreNextEvent = false
                return
            }
            
            this.ignoreNextEvent = true
            this.$refs[this.getContainerReference(to_container_index)].removeScore(this.fool_score)
        },
        onScoreRemoved(score, to_container_index) {
            if (this.ignoreNextEvent) {
                this.ignoreNextEvent = false
                return
            }

            if (score.code !== this.fool_score.code)
                return

            this.ignoreNextEvent = true
            this.$refs[this.getContainerReference(to_container_index)].removeFool()
        }
    },
    data() {
        return {
            disabled: false,
            ignoreNextEvent: false, // This is to prevent ping pong $emit issue from container left/right
            score_choosen: false,
            score_type_hidden_list: [{
                name: "Ippon",
                code: "I"
            }, {
                name: "Ippon",
                code: "O"
            }],
            score_type_list: [{
                name: "Men",
                code: "M"
            },{
                name: "Kote",
                code: "K"
            },{
                name: "Do",
                code: "D"
            },{
                name: "Tsuki",
                code: "T"
            },{
                name: "Hantei",
                code: "Ht"
            }, {
                name: "Hansokku",
                code: "△"
            }]
        }
    }
}
</script>

<template>
    <div class="row fight-versus--content">
        <!-- LEFT SCORE CONTAINER FOR A FIGHTER -->
        <div class="col">
            <score-drag-container
                :limit="FIGHT_LIMIT_SCORE"
                :scoreChoosen="score_choosen"
                :disabled="is_disabled"
                :canRemove="!readonly"
                :ref="getContainerReference(0)"

                @on-fool-reached="onFoolReached(1)"
                @on-fool-unreached="onFoolUnreached(1)"
                @on-score-reached="onScoreReached"
                @on-score-unreached="onScoreUnreached"
                @on-score-remove="score => onScoreRemoved(score, 1)"
            />
        </div>

        <!-- MIDDLE CONTAINER WITH ALL SCORE -->
        <div class="col-sm-1" v-if="!readonly">
            <draggable
                class="card d-flex flex-column align-items-center justify-content-center"
                
                :list="score_type_list"
                :group="{ name: 'score', pull: 'clone', put: false }"
                :sort="false"
                :move="onMove"

                @choose="score_choosen = true"
                @unchoose="score_choosen = false"
            >
                <button v-for="(score_type, index) in score_type_list" :key="index" :disabled="disabled" :title="score_type.name" class="btn btn-light btn--icon mb-4">
                    {{ score_type.code }}
                </button>
            </draggable>
        </div>

        <!-- RIGHT SCORE CONTAINER FOR A FIGHTER -->
        <div class="col">
            <score-drag-container
                :limit="FIGHT_LIMIT_SCORE"
                :scoreChoosen="score_choosen"
                :disabled="is_disabled"
                :canRemove="!readonly"
                :ref="getContainerReference(1)"

                @on-fool-reached="onFoolReached(0)"
                @on-fool-unreached="onFoolUnreached(0)"
                @on-score-reached="onScoreReached"
                @on-score-unreached="onScoreUnreached"
                @on-score-remove="score => onScoreRemoved(score, 0)"
            />
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

        .card {
            height: 100%;
        }
    }
}
</style>