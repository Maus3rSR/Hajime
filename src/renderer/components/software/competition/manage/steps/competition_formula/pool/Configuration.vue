<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import PoolListDraw from '@partials/pool/ListDraw'

export default {
    components: { PoolListDraw },
    props: {},
    computed: {
        ...mapState('configuration', ["COMPETITION_MINIMUM_ENTRANT","POOL_MIN_SIZE","POOL_MAX_SIZE","LAST_POOL_OFFSET"]),
        ...mapState('competition', {
            competition_id: state => state.model.id,
            competition_type: state => state.model.type,
        }),
        ...mapState('pool', {
            pool_configuration: state => state.configuration
        }),
        ...mapGetters({
            constant_type_list: "competition/constant_type_list",
            fighter_list: "competition/fighter_present_list",
            pool_saving: "pool/saving",
        }),
        ...mapFields('pool', {
            number_of_pool: 'configuration.number_of_pool',
            number_of_entry_per_pool: 'configuration.number_of_entry_per_pool',
            pool_locked: 'configuration.locked',
            pool_list: 'list',
            pool_status: 'status'
        }),
        list() { // TODO gérer retour liste d'équipes
            return this.fighter_list
        },
        count() {
            return this.list.length
        },
        has_enough_entrant() {
            return this.count >= this.COMPETITION_MINIMUM_ENTRANT
        },
        minimum_nb_pool_tested()
        {
            return parseInt(this.count / this.POOL_MAX_SIZE, 10)
        },
        number_of_pool_value_list() { // @TODO : Need some comments
            if (!this.has_enough_entrant)
                return []

            let list = []
            let nb_pool_tested = this.minimum_nb_pool_tested
            let number_of_entry_per_pool = this.getNumberOfEntrantPerPool(nb_pool_tested)

            do {
                const number_of_entry_left = this.getNumberOfEntrantLeft(nb_pool_tested)

                if (number_of_entry_per_pool <= this.POOL_MAX_SIZE && !(
                    number_of_entry_left > 0 && number_of_entry_left < this.POOL_MIN_SIZE ||
                    (number_of_entry_left > 0 && Math.abs(number_of_entry_left - number_of_entry_per_pool) > this.LAST_POOL_OFFSET) ||
                    number_of_entry_left == number_of_entry_per_pool
                ))
                    list.push({
                        number_of_pool: nb_pool_tested,
                        number_of_entry_per_pool: number_of_entry_per_pool,
                        number_of_entry_left: number_of_entry_left,
                        number_of_total_pool: number_of_entry_left > 0 ? nb_pool_tested + 1 : nb_pool_tested
                    })

                nb_pool_tested++
                number_of_entry_per_pool = this.getNumberOfEntrantPerPool(nb_pool_tested)
            } while (number_of_entry_per_pool >= this.POOL_MIN_SIZE && number_of_entry_per_pool <= this.POOL_MAX_SIZE)

            return list
        },
        entrant_label() {
            return this.competition_type == this.constant_type_list.TEAM ? "équipes" : "combattants"
        }
    },
    methods: {
        ...mapActions({
            createPool: "pool/CREATE",
            savePoolConfiguration: "pool/SAVE_CONFIGURATION",
            loadPoolList: "pool/LOAD_LIST"
        }),
        getNumberOfEntrantPerPool(number_of_pool) {
            return parseInt(this.count / number_of_pool, 10)
        },
        getNumberOfEntrantLeft(number_of_pool) {
            return this.count % number_of_pool
        },
        validatePoolList(pool_list) {
            if (this.pool_saving)
                return

            return this.savePoolConfiguration()
                .then(() => {
                    this.pool_status = "NOTHING" // TODO, trouver une solution pour régler ce problème ...

                    this.pool_list = pool_list.map(pool => {
                        pool.competition_formula_id = parseInt(this.pool_configuration.competition_formula_id, 10)
                        return pool
                    })

                    const promise = this.createPool()
                        
                    promise
                        .then(this.loadPoolList) // TODO, voir si hook afterBulkCreate serait pas plus intéréssant pour mettre à jour les données des relations ?
                        .then(() => {
                            this.pool_locked = true
                            return this.savePoolConfiguration()
                        })
                        .catch(() => {
                            this.pool_locked = false
                            return this.savePoolConfiguration()
                        })

                    return promise
                })
        }
    },
    watch: {
        number_of_pool_value_list: {
            handler: function(list) {
                if (!list.length)
                    return

                if (null === this.pool_option_list_choosen)
                    this.pool_option_list_choosen = list[0]
            },
            deep: true
        },
        pool_option_list_choosen: {
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
            pool_option_list_choosen: null,
        }
    }
}
</script>

<template>
    <div>
        <div class="form-group row">
            <label for="pool_configuration" class="col-sm-3 col-xl-2 col-form-label card-body__title">Nombre de poules</label>
            <div class="col-sm-9 col-xl-10">
                <select id="pool_configuration" class="form-control" v-model="pool_option_list_choosen">
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
            <software-container v-if="null != pool_option_list_choosen" limit-container="software__footer" element-scroll="poolListDraw">
                <pool-list-draw
                    id="poolListDraw"

                    :option_list="pool_option_list_choosen"
                    :configuration="pool_configuration"
                    :entry_list="fighter_list"

                    @on-validate="validatePoolList"
                />
            </software-container>
        </transition>
    </div>
</template>
