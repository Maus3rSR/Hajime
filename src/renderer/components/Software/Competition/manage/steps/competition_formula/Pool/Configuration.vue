<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import PoolListDraw from '@partials/pool/ListDraw'

export default {
    components: { PoolListDraw },
    props: {},
    computed: {
        ...mapState('configuration', {
            competition_minimum_entrant: "COMPETITION_MINIMUM_ENTRANT",
            min_per_pool: "POOL_MIN_SIZE",
            max_per_pool: "POOL_MAX_SIZE",
            last_pool_offset: "LAST_POOL_OFFSET",
        }),
        ...mapState('competition', {
            competition_id: state => state.model.id,
            competition_type: state => state.model.type,
        }),
        ...mapGetters({
            constant_type_list: "competition/constant_type_list",
            fighter_list: "competition/fighter_present_list",
            pool_saving: "pool/saving",
        }),
        ...mapFields('pool', {
            number_of_pool: 'model.number_of_pool',
            number_of_entry_per_pool: 'model.number_of_entry_per_pool',
            pool_locked: 'model.lock',
            pool_entry_list: 'model.pool_entry_list',
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
            let number_of_entry_per_pool = this.getNumberOfEntrantPerPool(nb_pool_tested)

            while (number_of_entry_per_pool >= this.min_per_pool && number_of_entry_per_pool <= this.max_per_pool) {
                const number_of_entry_left = this.getNumberOfEntrantLeft(nb_pool_tested)

                if (
                    !(
                        number_of_entry_left > 0 && number_of_entry_left < this.min_per_pool ||
                        (number_of_entry_left > 0 && Math.abs(number_of_entry_left - number_of_entry_per_pool) > this.last_pool_offset) ||
                        number_of_entry_left == number_of_entry_per_pool
                    )
                ) {
                    list.push({
                        number_of_pool: nb_pool_tested,
                        number_of_entry_per_pool: number_of_entry_per_pool,
                        number_of_entry_left: number_of_entry_left,
                        number_of_total_pool: number_of_entry_left > 0 ? nb_pool_tested + 1 : nb_pool_tested
                    })
                }

                nb_pool_tested++
                number_of_entry_per_pool = this.getNumberOfEntrantPerPool(nb_pool_tested)
            }

            return list
        },
        entrant_label() {
            return this.competition_type == this.constant_type_list.TEAM ? "équipes" : "combattants"
        }
    },
    methods: {
        ...mapActions({
            savePool: "pool/SAVE_ALL"
        }),
        getNumberOfEntrantPerPool(number_of_pool) {
            return parseInt(this.count / number_of_pool, 10)
        },
        getNumberOfEntrantLeft(number_of_pool) {
            return this.count % number_of_pool
        },
        validatePoolList(pool_entry_list) {
            if (this.pool_saving)
                return

            this.pool_locked = true
            this.pool_entry_list = pool_entry_list

            this.savePool().catch(() => {
                this.pool_locked = false
            })
        }
    },
    watch: {
        number_of_pool_value_list: {
            handler: function(list) {
                if (!list.length)
                    return

                if (null === this.pool_configuration)
                    this.pool_configuration = list[0]
            },
            deep: true
        },
        pool_configuration: {
            handler: function(config) {
                if (null === config)
                    return
                
                this.number_of_pool = config.number_of_total_pool
                this.number_of_entry_per_pool = config.number_of_entry_per_pool
            },
            deep: true
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
    <div>
        <div class="form-group row">
            <label for="pool_configuration" class="col-sm-3 col-xl-2 col-form-label card-body__title">Nombre de poules</label>
            <div class="col-sm-9 col-xl-10">
                <select id="pool_configuration" class="form-control" v-model="pool_configuration">
                    <option value="null" selected>Choisir une configuration</option>
                    <option v-for="pool_config in number_of_pool_value_list" :key="pool_config.number_of_pool" :value="pool_config">
                        {{ pool_config.number_of_pool }} poules de {{ pool_config.number_of_entry_per_pool }} {{ entrant_label }}
                        <template v-if="pool_config.number_of_entry_left">
                            et 1 poule de {{ pool_config.number_of_entry_left }} {{ entrant_label }}
                        </template>
                    </option>
                </select>
            </div>
        </div>

        <transition name="fade" mode="out-in">
            <software-container v-if="null != pool_configuration" limit-container="software__footer" element-scroll="poolListDraw">
                <pool-list-draw
                    id="poolListDraw"

                    :config="pool_configuration"
                    :entry_list="fighter_list"

                    @on-validate="validatePoolList"
                />
            </software-container>
        </transition>
    </div>
</template>
