<script>
import { mapGetters, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
    computed: {
        ...mapGetters({
            competition_type_list: "competition_type/all",
            fighter_list: "competition/fighter_list"
        }),
        ...mapFields('competition', ['fighter_list']),
        ...mapFields('competition', {
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
                <fighter-list v-model="fighter_list" :isTeam="competition_type == competition_type_list.TEAM" />
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
