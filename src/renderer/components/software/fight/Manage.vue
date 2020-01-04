<script>
import ScoreDragger from '@partials/fight/ScoreDragger'

export default {
    components: { ScoreDragger },
    computed: {
        
    },
    data() {
        return {

        }
    }
}
</script>

<template>
    <main class="fight-versus">
        <section class="card animated fadeIn">
            <div class="card-body">
                <div class="row fight-versus--title mb-4">
                    <div class="col text-right">
                        <div class="h2 animated fadeInLeftBig">
                            Combattant 1
                        </div>
                    </div>
                    <div class="col-sm-1 text-center">
                        <div class="h1 versus animated heartBeat">VS</div>
                    </div>
                    <div class="col">
                        <div class="h2 animated fadeInRightBig">
                            Combattant 2
                        </div>
                    </div>
                </div>

                <score-dragger />

                <div class="row fight-versus-footer mt-3">
                    <div class="col-sm-3">
                        <label class="ml-2 custom-control custom-checkbox">
                            <input class="custom-control-input" type="checkbox">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description">Mort subite (Enshõ)</span>
                        </label>
                    </div>

                    <div class="col text-right">
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