<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
    computed: {
        ...mapState('pool', {
            list: state => state.list,
        }),

    },
    methods: {
        getFightList(entry_list) {
            if (entry_list.length < 2)
                return []

            const total_fight = entry_list.length * (entry_list.length - 1) / 2
            let fight_matrix = {}
            let fight_list = []
            
            entry_list.forEach(entry => fight_matrix[entry.number] = entry_list.map(e => e.number).filter(n => n !== entry.number))

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

                let n2 = fight_matrix[n].splice(j, 1)[0] // retrieve n2 and remove from the row n
                let fight = [n, n2]

                fight_matrix[n2].splice(fight_matrix[n2].findIndex(el => el === n), 1) // remove the value n from the row n2 too because a fight is not two-legged

                if (n2 < n) // ordering
                    fight.reverse()

                fight_list.push(fight)

                j_cooldown--
                n += 2
            } while (fight_list.length !== total_fight)

            return fight_list
        }
    },
    data() {
        return {
            fight_list: []
        }
    },
    mounted() {
        this.fight_list = this.getFightList(this.list[0].entry_list)
    }
}
</script>

<template>
    <div>
        <ul>
            <li v-for="(fight, index) in fight_list" :key="index">{{ fight[0] }} x {{ fight[1] }}</li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>

</style>