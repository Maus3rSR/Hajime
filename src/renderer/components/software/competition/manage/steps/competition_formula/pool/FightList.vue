<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
    computed: {
        ...mapState('pool', {
            list: state => state.list,
        }),
        ...mapState('competition', {
            competition_type: state => state.model.type,
        }),
        ...mapState('configuration', {
            min_per_pool: "POOL_MIN_SIZE",
        }),
        ...mapGetters({
            constant_type_list: "competition/constant_type_list",
        }),
    },
    methods: {
        createFightMatrix(entry_list) {
            let fight_matrix = {}
            entry_list.forEach(entry => fight_matrix[entry.number] = entry_list.map(e => e.number).filter(n => n !== entry.number))
            return fight_matrix
        },
        getEntry(entry_list, pool_entry_number) {
            const entry = entry_list.find(entry => entry.number === pool_entry_number)
            return {
                entriable_id: entry.entriable_id,
                entriable: entry.entriable
            }
        },
        getFightList(entry_list) {
            if (entry_list.length < this.min_per_pool)
                return []

            const total_fight = entry_list.length * (entry_list.length - 1) / 2
            let fight_list = []
            let fight_matrix = this.createFightMatrix(entry_list)

            const change_j_each = 2
            let j_cooldown = change_j_each - 1 // switch directly after one loop
            let n = 1 // number of the pool
            let j = 0 // array index in the matrix
            do {
                if (n > entry_list.length)
                    n = n - entry_list.length

                while (fight_matrix[n].length === 0) {
                    if (n === entry_list.length)
                        n = 0
                    n++
                }

                if (j_cooldown === 0) {
                    j = j === 0 ? j = 1 : 0
                    j_cooldown = change_j_each
                }

                if (j !== 0)
                    j = fight_matrix[n].length - 1

                /**
                 * FIND FIGHTER 1 VS FIGHTER 2
                 */
                let n2 = fight_matrix[n].splice(j, 1)[0] // retrieve n2 and remove from the row n
                fight_matrix[n2].splice(fight_matrix[n2].findIndex(el => el === n), 1) // remove the value n from the row n2 too because a fight is not two-legged

                let fight = [this.getEntry(entry_list, n), this.getEntry(entry_list, n2)]

                if (n2 < n) // ordering
                    fight.reverse()

                fight_list.push(fight)
                /**
                 * END FIND FIGHTER 1 VS FIGHTER 2
                 */

                j_cooldown--
                n += 2
            } while (fight_list.length !== total_fight)

            return fight_list
        }
    },
    data() {
        return {
            fight_list_to_create: []
        }
    },
    created() {
        this.fight_list_to_create = this.list.map(pool => {
            return this.getFightList(pool.entry_list).map(fight => ({
                competition_formula_id: parseInt(pool.competition_formula_id, 10),
                entriable1_id: fight[0].entriable_id,
                entriable2_id: fight[1].entriable_id,
                entriable: fight[0].entriable,
            }))
        })
    }
}
</script>

<template>
    <div>
        <transition name="fade" mode="out-in">
            <div v-if="true" class="text-center">
                <h1>Aucune données de match... :'(</h1>
            </div>
            
            <div v-else-if="false">
                <div class="col text-center">
                    <h2>Generation des matchs en cours...</h2>
                </div>
                <clip-loader :color="'#fff'"></clip-loader>
            </div>

            <div v-else>

            </div>
        </transition>
    </div>
</template>

<style lang="scss" scoped>

</style>