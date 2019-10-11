<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import PoolConfiguration from './Pool/Configuration'
import PoolViewer from './Pool/Viewer'

export default {
    components: { PoolConfiguration, PoolViewer },
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
            pool_locked: state => state.configuration.lock
        }),
        ...mapGetters({
            fighter_list: "competition/fighter_present_list",
            is_pool_loading: "pool/loading",
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
            loadPoolConfiguration: "pool/LOAD_CONFIGURATION"
        })
    },
    data() {
        return {}
    },
    created() {
        if (this.competition_formula_id !== this.pool_competition_formula_id)
            this.loadPoolConfiguration(this.competition_formula_id)
    }
}
</script>

<template>
    <div class="competition__manage__pool">
        <transition name="fade" mode="out-in" appear>
            <div v-if="is_pool_configuration_empty" class="text-center">
                <h1>Aucune données de poule... :'(</h1>
            </div>

            <clip-loader v-else-if="is_pool_loading" :color="'#fff'"></clip-loader>

            <span v-else>
                <div v-if="has_enough_entry" class="competition__manage__pool">
                    <b-tabs pills card vertical>
                        <b-tab active>
                            <template slot="title">
                                <clip-loader v-if="is_pool_saving" class="float-left pr-2" :size="'14px'"></clip-loader>
                                {{ pool_tab_title }}
                            </template>

                            <pool-configuration/>
                            <!-- <pool-configuration v-if="!pool_list_validated" /> -->
                            <!-- <pool-viewer v-else /> -->
                        </b-tab>
                        <b-tab :disabled="!pool_locked || is_pool_saving">
                            <template slot="title">
                                <i v-if="!pool_locked" class="zmdi zmdi-block"></i>
                                Matchs
                            </template>

                            <span class="badge badge-warning text-white">
                                <i class="zmdi zmdi-alert-triangle"></i>
                                DEVELOPPEMENT EN COURS
                            </span>
                        </b-tab>
                    </b-tabs>
                </div>

                <div class="h5 text-warning" v-else>
                    <i class="zmdi zmdi-alert-triangle"></i>
                    Nombre de combattant insuffisant pour procéder à la répartition des poules.
                </div>
            </span>
        </transition>
    </div>
</template>

<style lang="scss">
.competition__manage__pool {
    .tab-pane {
        padding: 0 15px;
    }
}
</style>