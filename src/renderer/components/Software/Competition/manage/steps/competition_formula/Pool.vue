<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
    props: {
        config: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            fighter_list: "competition/fighter_present_list"
        }),
        list() { // TODO gérer retour liste d'équipes
            return this.fighter_list
        },
        count() {
            return this.list.length
        },
        can_display_pool_list() {
            return this.count >= this.minimum_list_size
        }
    },
    methods: {},
    watch: {},
    data() {
        return {
            minimum_list_size: 6, // TODO constante .env
            min_per_pool: 2, // TODO constante .env
            max_per_pool: 5, // TODO constante .env
            number_of_pool: null,
            number_of_fighter_per_pool: null
        }
    },
    mounted() {

    }
}
</script>

<template>
    <div v-if="can_display_pool_list">
        
    </div>
    <div class="h5 text-warning" v-else>
        <i class="zmdi zmdi-alert-triangle"></i>
        Nombre de combattant insuffisant pour procéder à la répartition des poules.
    </div>
</template>

<style lang="scss" scoped>

</style>