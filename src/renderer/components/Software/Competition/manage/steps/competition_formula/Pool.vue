<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import Pool from '@partials/pool/Component'

export default {
    components: { Pool },
    props: {
        config: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapState('configuration', {
            competition_minimum_entrant: "COMPETITION_MINIMUM_ENTRANT",
            min_per_pool: "POOL_MIN_SIZE",
            max_per_pool: "POOL_MAX_SIZE",
        }),
        ...mapGetters({
            fighter_list: "competition/fighter_present_list"
        }),
        list() { // TODO gérer retour liste d'équipes
            return this.fighter_list
        },
        count() {
            return this.list.length
        },
        has_enough_entrant() {
            return this.count >= this.competition_minimum_entrant
        },
        minimum_nb_pool_tested()
        {
            return parseInt(this.count / this.max_per_pool, 10)
        },
        number_of_pool_value_list() {
            if (!this.has_enough_entrant)
                return []

            let list = []
            let nb_pool_tested = this.minimum_nb_pool_tested
            let number_of_entrant_per_pool = this.getNumberOfEntrantPerPool(nb_pool_tested)

            while (number_of_entrant_per_pool >= this.min_per_pool && number_of_entrant_per_pool <= this.max_per_pool) {
                const number_of_entrant_left = this.getNumberOfEntrantLeft(nb_pool_tested)

                if (!(number_of_entrant_left > 0 && number_of_entrant_left < this.min_per_pool || number_of_entrant_left > number_of_entrant_per_pool))
                    list.push({
                        number_of_pool: nb_pool_tested,
                        number_of_entrant_per_pool: number_of_entrant_per_pool
                    })

                nb_pool_tested++
                number_of_entrant_per_pool = this.getNumberOfEntrantPerPool(nb_pool_tested)
            }

            return list
        },
    },
    methods: {
        getNumberOfEntrantPerPool(number_of_pool) {
            return parseInt(this.count / number_of_pool, 10)
        },
        getNumberOfEntrantLeft(number_of_pool) {
            return this.count % number_of_pool
        }
    },
    watch: {
        number_of_pool_value_list: {
            handler: function(list) {
                if (!list.length)
                    return

                if (null == this.number_of_pool)
                    this.number_of_pool = list[0].number_of_pool
            },
            deep: true,
            immediate: true
        }
    },
    data() {
        return {
            number_of_pool: null,
        }
    }
}
</script>

<template>
    <div v-if="has_enough_entrant">
        <div class="form-group row">
            <label for="number_of_pool" class="col-sm-3 col-xl-2 col-form-label card-body__title">Nombre de poules</label>
            <div class="col-sm-9 col-xl-10">
                <select id="number_of_pool" class="form-control" v-model="number_of_pool">
                    <!-- TODO Label combattants / équipes -->
                    <option v-for="pool in number_of_pool_value_list" :key="pool.number_of_pool" :value="pool.number_of_pool">{{ pool.number_of_pool }} poules de {{ pool.number_of_entrant_per_pool }} combattants</option>
                </select>
            </div>
        </div>

        <!-- <div class="row">
            <div class="col" v-for="pool_number in number_of_pool" :key="pool_number">
                <pool />
            </div>
        </div> -->
    </div>

    <div class="h5 text-warning" v-else>
        <i class="zmdi zmdi-alert-triangle"></i>
        Nombre de combattant insuffisant pour procéder à la répartition des poules.
    </div>
</template>

<style lang="scss" scoped>

</style>