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
            has_fight_list: "pool/has_fight_list"
        })
    },
    methods: {},
    data() {
        return {}
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
                <b-tabs pills card vertical>
                    <b-tab v-for="(pool, index) in list" :key="index" :active="index === 0">
                        <template slot="title">Poule n°{{ pool.number }}</template>

                        <fight-list :list="pool.fight_list" :key="pool.number" />
                    </b-tab>
                </b-tabs>
            </div>
        </transition>
    </div>
</template>