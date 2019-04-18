<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import FighterList from '@partials/list/FighterList/Component'

export default {
    components: { FighterList },
    computed: {
        ...mapState('competition', {
            competition_type: state => state.model.type,
            is_fighter_list_lock: state => state.model.locked_fighter_list
        }),
        ...mapState('configuration', {
            competition_minimum_entrant: "COMPETITION_MINIMUM_ENTRANT",
        }),
        ...mapGetters({
            fighter_present_count: "competition/fighter_present_count",
            competition_saving: "competition/saving",
        }),
        ...mapFields('competition', {
            fighter_list: 'model.fighter_list',
            locked_fighter_list: 'model.locked_fighter_list'
        }),
        step_is_valid() {
            return this.fighter_present_count >= this.competition_minimum_entrant
        },
    },
    methods: {
        ...mapActions({
            saveCompetition: "competition/SAVE"
        }),
        save() {
            if (this.competition_saving) return

            this.locked_fighter_list = true
            this.saveCompetition().then(() => this.$emit('onValidate'))
        },
        confirm() {
            this.$refs.modalConfirmCall.show()
        },
        process() {
            if (this.competition_saving) return

            if (this.is_fighter_list_lock) {
                this.$emit('onValidate')
                return
            }

            this.confirm()
        }
    }
}
</script>

<template>
    <div>
        <div class="row">
            <div class="col-sm-12">
                <fighter-list
                    v-model="fighter_list"
                    :competition_type="competition_type"
                    :make_the_call="true"
                    :readonly="is_fighter_list_lock"
                />
            </div>
        </div>

        <div class="row software__container--offset-element">
            <div class="col">
                <transition name="fade" type="out-in">
                    <span class="text-warning" v-if="!step_is_valid">
                        <i class="zmdi zmdi-alert-triangle"></i>
                        Nombre de combattant insuffisant pour procéder à la compétition
                    </span>
                </transition>
            </div>
            <div class="col">
                <button :disabled="!step_is_valid" :class="{'btn-outline-success tada': step_is_valid}" class="btn float-right animated" @click="process">
                    Tour suivant
                    <transition name="fade" mode="out-in">
                        <i v-if="!competition_saving" class="zmdi zmdi-arrow-right"></i>
                        <clip-loader v-else :size="'14px'"></clip-loader>
                    </transition>
                </button>
            </div>
        </div>

        <modal-confirmation
            ref="modalConfirmCall"
            title="Confirmation de la liste d'appel"

            @on-confirm="save"
        >
            <template slot="label">
                Confirmez vous cette liste d'appel ?
            </template>

            <template slot="content">
                Vous ne pourrez plus modifier cette liste d'appel après cette confirmation.
                Elle sera toujours disponible en lecture seule.
            </template>
        </modal-confirmation>
    </div>
</template>
