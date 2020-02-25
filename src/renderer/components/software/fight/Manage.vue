<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import ScoreDragger from '@partials/fight/ScoreDragger'

export default {
    components: { ScoreDragger },
    props: {
        fight_id: { required: true },
        fighter1_id: { required: true },
        fighter2_id: { required: true },
    },
    computed: {
        ...mapState('fight_board', ['fight','fighter1','fighter2']),
        ...mapGetters({
            is_empty_fight: "fight_board/is_empty_fight",
            is_empty_fighter1: "fight_board/is_empty_fighter1",
            is_empty_fighter2: "fight_board/is_empty_fighter2",
        })
    },
    methods: {
        ...mapActions({
            loadFightBoard: "fight_board/LOAD"
        })
    },
    data() {
        return {
            marking_board_reversed: false,
            readonly: false
        }
    },
    created() {
        if (this.fight_id !== this.fight.id)
            this.loadFightBoard({
                fight_id: this.fight_id,
                fighter1_id: this.fighter1_id,
                fighter2_id: this.fighter2_id
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
                    :readonly="readonly"
                />

                <div class="row fight-versus-footer mt-3">
                    <div class="col-sm-3">
                        <label class="ml-2 custom-control custom-checkbox">
                            <input class="custom-control-input" type="checkbox" :disabled="readonly">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description">Mort subite (Enshõ)</span>
                        </label>
                    </div>

                    <div class="col text-right" v-if="!readonly">
                        <transition name="fade" mode="out-in">
                            <span v-if="1">
                                <button class="btn btn-link">
                                    Déclarer un forfait
                                    <i class="zmdi zmdi-close"></i>
                                </button>
                                <button class="btn btn-outline-success">
                                    Valider
                                    <i class="zmdi zmdi-check"></i>
                                </button>
                            </span>
                            <span class="text-success" v-else>
                                Ce match a été validé
                                <i class="zmdi zmdi-check"></i>
                            </span>
                        </transition>

                    </div>
                </div>
            </div>
        </section>
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
}
</style>