<script>
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import Configuration from './tree/Configuration'
import Viewer from './tree/Viewer'
import FightList from './tree/FightList'

export default {
    components: { Configuration, Viewer, FightList },
    props: {
        formula_id: {
            type: Number,
            required: true
        },
    },
    computed: {
        ...mapState('configuration', ["COMPETITION_MINIMUM_ENTRANT"]),
        ...mapState('tree', {
            competition_formula_id: state => state.configuration.competition_formula_id,
            is_locked: state => state.configuration.locked,
            list: state => state.list
        }),
        ...mapGetters({
            entry_count: "competition/entry_present_count",
            is_loading: "tree/loading",
            is_list_loading: "tree/list_loading",
            is_saving: "tree/saving",
            is_configuration_empty: "tree/is_configuration_empty",
        }),
        has_enough_entry() {
            return this.entry_count >= this.COMPETITION_MINIMUM_ENTRANT
        },
        list_validated() {
            return this.is_locked && !this.is_saving
        },
        tab_title() {
            return this.list_validated ? "Arbre éliminatoire" : "Tirage au sort"
        },
        fight_list_tab_style() {
            return {
                width: `0%`
            }
        }
    },
    methods: {
        ...mapActions({
            loadConfiguration: "tree/LOAD_CONFIGURATION",
            loadList: "tree/LOAD_LIST",
            create: "tree/create"
        }),
        onTabShown() {
            this.$softwareContainer.$emit('forceResize')
        }
    },
    watch: {},
    mounted() {
        if (this.formula_id !== this.competition_formula_id)
            this.loadConfiguration(this.formula_id).then(() => this.loadList(this.formula_id))
    }
}
</script>

<template>
    <div class="competition__manage__tree">
        <transition name="fade" mode="out-in" appear>
            <div v-if="is_configuration_empty" class="text-center">
                <h1>Aucune données d'arbre éliminatoire... :'(</h1>
            </div>

            <clip-loader v-else-if="is_loading || is_list_loading" :color="'#fff'"></clip-loader>

            <span v-else>
                <transition name="fade" mode="out-in" appear>
                    <div v-if="has_enough_entry">
                        <div class="row">
                            <div class="col-sm-12">
                                <b-tabs @input="onTabShown" pills card vertical>
                                    <b-tab active>
                                        <template slot="title">
                                            {{ tab_title }}
                                        </template>

                                        <configuration v-if="!list_validated" />
                                        <viewer v-else />
                                    </b-tab>
                                    <b-tab :disabled="!is_locked || is_saving">
                                        <template slot="title">
                                            <i v-if="!is_locked" class="zmdi zmdi-block"></i>
                                            <!-- <span class="nav-link__progress" :style="fight_list_tab_style"></span> -->
                                            Combats
                                        </template>

                                        <fight-list v-if="is_locked" />
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