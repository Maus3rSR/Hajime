<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import FighterList from '@partials/list/FighterList/Component'

export default {
    components: { FighterList },
    computed: {
        ...mapState('competition', {
            competition_type: state => state.model.type,
        }),
        ...mapGetters({
            fighter_present_count: "competition/fighter_present_count",
            competition_saving: "competition/saving",
        }),
        ...mapFields('competition', {
            fighter_list: 'model.fighter_list'
        }),
        step_is_valid() {
            return this.fighter_present_count > 0
        },
    },
    methods: {
        ...mapActions({
            saveCompetition: "competition/SAVE"
        }),
        save() {
            if (this.competition_saving) return
            this.saveCompetition().then(() => this.$emit('onValidate'))
        }
    }
}
</script>

<template>
    <div>
        <div class="row">
            <div class="col-sm-12">
                <fighter-list v-model="fighter_list" :competition_type="competition_type" :make_the_call="true" />
            </div>
        </div>

        <div class="row software__container--offset-element">
            <div class="col">
                <button :disabled="!step_is_valid" :class="{'btn-outline-success tada': step_is_valid}" class="btn float-right animated" @click="save()">
                    Tour suivant
                    <transition name="fade" mode="out-in">
                        <i v-if="!competition_saving" class="zmdi zmdi-arrow-right"></i>
                        <clip-loader v-else :size="'14px'"></clip-loader>
                    </transition>
                </button>
            </div>
        </div>
    </div>
</template>
