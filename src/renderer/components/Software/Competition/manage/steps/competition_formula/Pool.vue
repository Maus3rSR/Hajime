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
            last_pool_offset: "LAST_POOL_OFFSET",
        }),
        ...mapState('competition', {
            competition_type: state => state.model.type,
        }),
        ...mapGetters({
            constant_type_list: "competition/constant_type_list",
            fighter_list: "competition/fighter_present_list",
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

                if (
                    !(
                        number_of_entrant_left > 0 && number_of_entrant_left < this.min_per_pool ||
                        (number_of_entrant_left > 0 && Math.abs(number_of_entrant_left - number_of_entrant_per_pool) > this.last_pool_offset) ||
                        number_of_entrant_left == number_of_entrant_per_pool
                    )
                ) {
                    list.push({
                        number_of_pool: nb_pool_tested,
                        number_of_entrant_per_pool: number_of_entrant_per_pool,
                        number_of_entrant_left: number_of_entrant_left,
                        number_of_total_pool: number_of_entrant_left > 0 ? nb_pool_tested + 1 : nb_pool_tested
                    })
                }

                nb_pool_tested++
                number_of_entrant_per_pool = this.getNumberOfEntrantPerPool(nb_pool_tested)
            }

            return list
        },
        entrant_label() {
            return this.competition_type == this.constant_type_list.TEAM ? "équipes" : "combattants"
        }
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

                if (null == this.pool_configuration)
                    this.pool_configuration = list[0]
            },
            deep: true,
            immediate: true
        }
    },
    data() {
        return {
            pool_configuration: null,
        }
    }
}
</script>

<template>
    <div v-if="has_enough_entrant">
        <div class="form-group row">
            <label for="pool_configuration" class="col-sm-3 col-xl-2 col-form-label card-body__title">Nombre de poules</label>
            <div class="col-sm-9 col-xl-10">
                <select id="pool_configuration" class="form-control" v-model="pool_configuration">
                    <!-- TODO Label combattants / équipes -->
                    <option v-for="pool_config in number_of_pool_value_list" :key="pool_config.number_of_pool" :value="pool_config">
                        {{ pool_config.number_of_pool }} poules de {{ pool_config.number_of_entrant_per_pool }} {{ entrant_label }}
                        <template v-if="pool_config.number_of_entrant_left">
                            et 1 poule de {{ pool_config.number_of_entrant_left }} {{ entrant_label }}
                        </template>
                    </option>
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