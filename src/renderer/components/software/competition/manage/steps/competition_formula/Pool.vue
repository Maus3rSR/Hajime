<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import PoolConfiguration from './pool/Configuration'
import PoolViewer from './pool/Viewer'
import PoolFightList from './pool/FightList'

export default {
    components: { PoolConfiguration, PoolViewer, PoolFightList },
    props: {
        competition_formula_id: {
            type: Number,
            required: true
        }
    },
    computed: {
        ...mapState('configuration', {
            competition_minimum_entrant: "COMPETITION_MINIMUM_ENTRANT"
        }),
        ...mapState('pool', {
            pool_competition_formula_id: state => state.configuration.competition_formula_id,
            pool_locked: state => state.configuration.locked
        }),
        ...mapGetters({
            fighter_list: "competition/fighter_present_list",
            is_pool_loading: "pool/loading",
            is_pool_list_loading: "pool/list_loading",
            is_pool_saving: "pool/saving",
            is_pool_configuration_empty: "pool/is_configuration_empty"
        }),
        entry_list() { // TODO gérer retour liste d'équipes
            return this.fighter_list
        },
        entry_count() {
            return this.entry_list.length
        },
        has_enough_entry() {
            return this.entry_count >= this.competition_minimum_entrant
        },
        pool_list_validated() {
            return this.pool_locked && !this.is_pool_saving
        },
        pool_tab_title() {
            return this.pool_list_validated ? "Liste des poules" : "Tirage au sort"
        }
    },
    methods: {
        ...mapActions({
            loadPoolConfiguration: "pool/LOAD_CONFIGURATION",
            loadPoolList: "pool/LOAD_LIST"
        }),
        onTabShown() {
            this.$softwareContainer.$emit('forceResize')
        }
    },
    data() {
        return {}
    },
    created() {
        if (this.competition_formula_id !== this.pool_competition_formula_id)
            this.loadPoolConfiguration(this.competition_formula_id).then(() => 
                this.loadPoolList(this.competition_formula_id))
    }
}
</script>

<template>
    <div class="competition__manage__pool">
        <transition name="fade" mode="out-in" appear>
            <div v-if="is_pool_configuration_empty" class="text-center">
                <h1>Aucune données de poule... :'(</h1>
            </div>

            <clip-loader v-else-if="is_pool_loading || is_pool_list_loading" :color="'#fff'"></clip-loader>

            <span v-else>
                <transition name="fade" mode="out-in" appear>
                    <div v-if="has_enough_entry">
                        <div class="row">
                            <div class="col-sm-12">
                                <b-tabs @input="onTabShown" pills card vertical>
                                    <b-tab active>
                                        <template slot="title">
                                            {{ pool_tab_title }}
                                        </template>

                                        <pool-configuration v-if="!pool_list_validated" />
                                        <pool-viewer v-else />
                                    </b-tab>
                                    <b-tab :disabled="!pool_locked || is_pool_saving">
                                        <template slot="title">
                                            <i v-if="!pool_locked" class="zmdi zmdi-block"></i>
                                            Combats
                                        </template>

                                        <pool-fight-list v-if="pool_locked" />
                                    </b-tab>
                                </b-tabs>
                            </div>
                        </div>

                        <div class="row software__container--offset-element">
                            <div class="col">
                                <button :disabled="true" :class="{'btn-outline-success tada': false}" class="btn float-right animated" @click="true">
                                    Tour suivant
                                    <transition name="fade" mode="out-in">
                                        <i v-if="true" class="zmdi zmdi-arrow-right"></i>
                                        <clip-loader v-else :size="'14px'"></clip-loader>
                                    </transition>
                                </button>

                                <button class="btn btn-link float-right mr-2" @click="$emit('onBack')">
                                    <i class="zmdi zmdi-arrow-left"></i>
                                    Tour précédent
                                </button>
                            </div>
                        </div>
                    </div>
                    

                    <div class="h5 text-warning" v-else>
                        <i class="zmdi zmdi-alert-triangle"></i>
                        Nombre de combattant insuffisant pour procéder à la répartition des poules.
                    </div>
                </transition>
            </span>
        </transition>
    </div>
</template>

<style lang="scss" scoped>
.software__container--offset-element {
    & > .col {
       margin-top: 2.3rem;
    }
}
</style>