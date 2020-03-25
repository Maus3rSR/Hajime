<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import FightList from '@partials/list/fight_list/Component'

export default {
    components: { FightList },
    computed: {
        ...mapState('pool', {
            list: state => state.list,
        }),
        ...mapGetters({
            entry_field: 'pool/entry_field',
            has_fight_list: "pool/has_fight_list",
            get_pool_finished_fight_list_percent: "pool/getTotalFightFinishedPercentageOfPool"
        })
    },
    methods: {
        ...mapActions({
            reverseMarkingBoard: "pool/REVERSE_MARKING_BOARD",
            addFight: "pool/ADD_FIGHT"
        }),
        onTabShown() {
            this.$softwareContainer.$emit('forceResize')
        },
        getPoolTabStyle(pool_id) {
            return {
                width: `${this.get_pool_finished_fight_list_percent(pool_id)}%`
            }
        },
        openNewFightModal(pool) {
            this.new_fight.entry_left = pool.entry_list[0]
            this.new_fight.entry_right = pool.entry_list[1]
            this.new_fight.entry_list = pool.entry_list

            this.$refs.modalAddFight.show()
        },
        addNewFight() {

        }
    },
    data() {
        return {
            new_fight: { 
                entry_list: [],
                entry_left: null,
                entry_right: null
            }
        }
    },
}
</script>

<template>
    <div class="competition__manage__pool__fight_list">
        <transition name="fade" mode="out-in">
            <div v-if="!has_fight_list" class="text-center">
                <h1>Aucune données de match... :'(</h1>
            </div>

            <div v-else>
                <b-tabs @input="onTabShown" pills card vertical>
                    <b-tab v-for="(pool, index) in list" :key="index" :active="index === 0">
                        <template slot="title">
                            <span class="nav-link__progress" :style="getPoolTabStyle(pool.id)"></span>
                            Poule n°{{ pool.number }}
                        </template>
                        
                        <fight-list
                            :list="pool.fight_list"
                            :index="pool.number"
                            :title="`Matchs de la poule N°${pool.number}`"
                            :marking_board_reversed="pool.marking_board_reversed"
                            
                            @makeReverse="reverseMarkingBoard(pool.id)"
                        >

                            <template slot="list-footer">
                                <button class="btn btn-link btn-lg btn__add-fight" @click.prevent="openNewFightModal(pool)">
                                    <i class="zmdi zmdi-plus"></i>
                                    Ajouter un match supplémentaire
                                </button>
                            </template>

                        </fight-list>
                    </b-tab>
                </b-tabs>
            </div>
        </transition>

        <modal-confirmation
            ref="modalAddFight"
            title="Ajout d'un combat supplémentaire"
            :header="false"

            @on-confirm="addFight(new_fight)"
        >
            <template slot="content">

                <div class="row">
                    <div class="col-md-6">
                        <label class="card-body__title">Combattant gauche</label>
                        <select class="form-control" v-model="new_fight.entry_left">
                            <option v-for="entry in new_fight.entry_list" :value="entry" :key="entry.id" :disabled="entry.id === new_fight.entry_right.id">
                                {{ entry[entry_field].name }}
                            </option>
                        </select>
                    </div>

                    <div class="col-md-6">
                        <label class="card-body__title">Combattant droite</label>
                        <select class="form-control" v-model="new_fight.entry_right">
                            <option v-for="entry in new_fight.entry_list" :value="entry" :key="entry.id" :disabled="entry.id === new_fight.entry_left.id">
                                {{ entry[entry_field].name }}
                            </option>
                        </select>
                    </div>
                </div>

            </template>
        </modal-confirmation>

    </div>
</template>

<style lang="scss">
.competition__manage__pool__fight_list {
    .nav-pills {
        max-height: 61vh;
        overflow: auto;
        flex-wrap: nowrap;
    }
}
</style>