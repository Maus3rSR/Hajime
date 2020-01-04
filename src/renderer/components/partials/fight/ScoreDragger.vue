<script>
import { mapState } from 'vuex'
import ScoreDragContainer from './ScoreDragContainer'

export default {
    components: { ScoreDragContainer },
    computed: {
        ...mapState("configuration", ["FIGHT_LIMIT_SCORE"])
    },
    methods: {
        onMove() { return 1 } // Avoid swap on 2 elements
    },
    data() {
        return {
            score_choosen: false,
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
        <div class="col">
            <score-drag-container
                :limit="FIGHT_LIMIT_SCORE"
                :scoreChoosen="score_choosen"
            />
        </div>

        <div class="col-sm-1">
            <draggable
                class="card d-flex flex-column align-items-center justify-content-center"
                
                :list="score_type_list"
                :group="{ name: 'score', pull: 'clone', put: false }"
                :sort="false"
                :move="onMove"

                @choose="score_choosen = true"
                @unchoose="score_choosen = false"
            >
                <button v-for="(score_type, index) in score_type_list" :key="index" :title="score_type.name" class="btn btn-light btn--icon mb-4">
                    {{ score_type.code }}
                </button>
            </draggable>
        </div>

        <div class="col">
            <score-drag-container
                :limit="FIGHT_LIMIT_SCORE"
                :scoreChoosen="score_choosen"
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