<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import FighterList from '@partials/list/FighterList/Component'

export default {
    components: { FighterList },
    computed: {
        ...mapFields('competition', {
            fighter_list: 'fighter_list',
            competition_type: 'type'
        }),
        step_is_valid() {
            return this.fighter_list.length > 0
        },
    },
    methods: {}
}
</script>

<template>
    <div>
        <div class="row">
            <div class="col-sm-12">
                <fighter-list v-model="fighter_list" :competition_type="competition_type" />
            </div>
        </div>

        <div class="row software__container--offset-element">
            <div class="col">
                <button :disabled="!step_is_valid" :class="{'btn-outline-success': step_is_valid}" class="btn float-right" @click="$emit('onValidate')">
                    Etape suivante
                    <i class="zmdi zmdi-arrow-right"></i>
                </button>
                
                <button class="btn btn-link float-right mr-2" @click="$emit('onBack')">
                    <i class="zmdi zmdi-arrow-left"></i>
                    Etape précédente
                </button>
            </div>
        </div>
    </div>
</template>
