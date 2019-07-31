<script>
import { mapGetters, mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import { TabsPlugin } from 'bootstrap-vue'
import PoolConfiguration from './Pool/Configuration'

export default {
    components: { PoolConfiguration, TabsPlugin },
    props: {
        config: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapState('configuration', {
            competition_minimum_entrant: "COMPETITION_MINIMUM_ENTRANT"
        }),
        ...mapGetters({
            fighter_list: "competition/fighter_present_list",
            pool_saving: "pool/saving",
        }),
        ...mapFields('pool', {
            pool_locked: 'model.lock',
            pool_list: 'model.pool_list',
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
        pool_configuration_title() {
            return this.pool_locked && !pool_saving ?
                "Poules" : "Tirage au sort"
        }
    },
    methods: {},
    data() {
        return {}
    }
}
</script>

<template>
    <div v-if="has_enough_entrant" class="competition__manage__pool">
        <b-tabs pills card vertical>
            <b-tab active>
                <template slot="title">
                    <clip-loader v-if="pool_saving" class="float-left pr-2" :size="'14px'"></clip-loader>
                    Tirage au sort
                </template>

                <pool-configuration :config="config" />
            </b-tab>
            <b-tab :disabled="!pool_locked || pool_saving">
                <template slot="title">
                    <i v-if="!pool_locked" class="zmdi zmdi-block"></i>
                    Matchs
                </template>
            </b-tab>
        </b-tabs>
    </div>

    <div class="h5 text-warning" v-else>
        <i class="zmdi zmdi-alert-triangle"></i>
        Nombre de combattant insuffisant pour procéder à la répartition des poules.
    </div>
</template>

<style lang="scss">
.competition__manage__pool {
    .tab-pane {
        padding: 0 15px;
    }
}
</style>