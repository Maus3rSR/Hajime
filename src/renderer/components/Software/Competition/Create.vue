<script>
import Vuex from 'vuex'
import Step1 from './steps/Form'
import Step2 from './steps/Import'

export default {
    components: { Step1, Step2 },
    computed: {
        step_component() {
            return "step"+this.current_step
        }
    },
    methods: {
        nextStep() {
            this.current_step = this.current_step + 1
        }
    },
    data() {
        return {
            current_step: 1
        }
    }
}
</script>

<template>
    <div id="competition__create">

        <header class="content__title">
            <h1>Nouvelle compétition</h1>

            <div class="actions">
                <router-link to="/" class="actions__item zmdi zmdi-close" title="Annuler et revenir à l'écran principal"></router-link>
            </div>
        </header>

        <div class="card">
            <div class="card-body">

                <nav aria-label="step-wizard" role="navigation">
                    <ol class="breadcrumb mb-4">
                        <li aria-current="step" class="breadcrumb-item" :class="{ active: current_step >= 1 }">1. Formulaire</li>
                        <li aria-current="step" class="breadcrumb-item" :class="{ active: current_step >= 2 }">2. Import des combattants</li>
                        <li aria-current="step" class="breadcrumb-item" :class="{ active: current_step >= 3 }">3. Tirage au sort</li>
                    </ol>
                </nav>

                <transition name="fade" mode="out-in">
                    <component :is="step_component" @validate="nextStep()"></component>
                </transition>

            </div>
        </div>


    </div>
</template>

<style lang="scss">

</style>
