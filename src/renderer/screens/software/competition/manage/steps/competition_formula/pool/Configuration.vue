<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import PoolListDraw from '@partials/pool/ListDraw'

import { setupVueI18nMessages } from '@config/i18n'
import translations from '@lang/screens/software/competition/steps/pool/messages'

export default {
    i18n: setupVueI18nMessages(translations),
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
            entry_list: "competition/entry_present_list",
            pool_saving: "pool/saving",
        }),
        ...mapFields('pool', {
            number_of_pool: 'configuration.number_of_pool',
            number_of_entry_per_pool: 'configuration.number_of_entry_per_pool',
            pool_list: 'list',
            pool_status: 'status'
        }),
        count() {
            return this.entry_list.length
        },
        minimum_nb_pool_tested()
        {
            return parseInt(this.count / this.POOL_MAX_SIZE, 10)
        },
        number_of_pool_value_list() { // @TODO : Need some comments
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
        is_team() {
            return this.competition_type === this.constant_type_list.TEAM
        },
        entrant_label() {
            return this.is_team ? this.$t("common.teams") : this.$t("common.fighters")
        },
        entriable() {
            return this.is_team ? "Team" : "Fighter"
        }
    },
    methods: {
        ...mapActions({
            create: "pool/CREATE",
            saveConfiguration: "pool/SAVE_CONFIGURATION",
        }),
        getNumberOfEntrantPerPool(number_of_pool) {
            return parseInt(this.count / number_of_pool, 10)
        },
        getNumberOfEntrantLeft(number_of_pool) {
            return this.count % number_of_pool
        },
        validateList(pool_list) {
            if (this.pool_saving)
                return

            return this.saveConfiguration()
                .then(() => {
                    this.pool_status = "NOTHING" // TODO, trouver une solution pour régler ce problème ...
                    this.pool_list = pool_list
                    return this.create()
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
            <label for="pool_configuration" class="col-sm-3 col-xl-2 col-form-label card-body__title">{{ $t("pool.configuration.number") }}</label>
            <div class="col-sm-9 col-xl-10">
                <select id="pool_configuration" class="form-control" v-model="pool_option_list_choosen">
                    <option value="null" selected>{{ $t("pool.configuration.choose") }}</option>
                    <option v-for="pool_config in number_of_pool_value_list" :key="pool_config.number_of_pool" :value="pool_config">
                        {{ pool_config.number_of_pool }} {{ $tc("pool.label", pool_config.number_of_pool) }} {{ $t("common.of.label") }} {{ pool_config.number_of_entry_per_pool }} {{ entrant_label | lowercase }}
                        <template v-if="pool_config.number_of_entry_left">
                            {{ $t("common.and") }} 1 {{ $tc("pool.label", 1) }} {{ $t("common.of.label") }} {{ pool_config.number_of_entry_left }} {{ entrant_label | lowercase }}
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
                    :entry_list="entry_list"
                    :entriable="entriable"

                    @on-validate="validateList"
                />
            </software-container>
        </transition>
    </div>
</template>
