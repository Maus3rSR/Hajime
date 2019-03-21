<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Step1 from './steps/Form'
import Step2 from './steps/FighterImport'
import Step3 from './steps/CompetitionFormula'

export default {
    components: { Step1, Step2, Step3 },
    computed: {
        ...mapState('competition', {
            competition_id: state => state.model.id,
        }),
        ...mapGetters({
            fighter_count: "competition/fighter_count"
        }),
        step_component() {
            return "step"+this.current_step
        },
        step_list() {
            return [
                {
                    name: "Informations générales"
                },
                {
                    name: "Import des combattants",
                    count: this.fighter_count
                },
                {
                    name: "Formule de compétition"
                }
            ]
        },
        is_last_step() {
            return this.current_step == this.step_list.length
        }
    },
    methods: {
        ...mapActions({
            clearCompetition: "competition/CLEAR",
        }),
        nextStep() {
            this.current_step = this.current_step + 1
        },
        previousStep() {
            this.current_step = this.current_step - 1
        },
        goToStep(step) {
            if (this.current_step <= step)
                return

            this.current_step = step
        },
        redirectToCompetition() {
            this.$router.push({ name: 'competition', params: { id: this.competition_id } })
        }
    },
    data() {
        return {
            current_step: 1,
        }
    },
    mounted() {
        this.clearCompetition()
    }
}
</script>

<template>
    <div id="competition__create">

        <header class="content__title">
            <h1>Nouvelle compétition</h1>

            <div class="actions">
                <router-link to="/" class="btn btn-dark btn--icon-text">
                    <i class="zmdi zmdi-close"></i> Annuler et revenir à l'écran principal
                </router-link>
                
                <transition name="fade" mode="out-in">
                    <button v-if="current_step > 1" class="btn btn-dark btn--icon-text" @click.prevent="previousStep()">
                        <i class="zmdi zmdi-arrow-left"></i> Revenir à l'étape précédente
                    </button>
                </transition>
            </div>
        </header>

        <div class="card">
            <div class="card-body">

                <nav aria-label="step-wizard" role="navigation">
                    <ol class="breadcrumb mb-4 software__container--offset-element">
                        <li v-for="(step, index) in step_list" :key="index" @click="goToStep(index+1)" class="breadcrumb-item" :class="{ active: current_step >= index+1 }">
                            {{ index+1 }}. {{ step.name }} <span v-if="null !== step.count" class="badge badge-pill badge-primary">{{ step.count }}</span>
                        </li>
                    </ol>
                </nav>

                <transition name="fade" mode="out-in">
                    <component :is="step_component" @onValidate="is_last_step ? redirectToCompetition() : nextStep()" @onBack="previousStep()"></component>
                </transition>
            </div>
        </div>


    </div>
</template>

<style lang="scss">
    .breadcrumb-item.active {
        cursor: pointer;
    }
</style>
