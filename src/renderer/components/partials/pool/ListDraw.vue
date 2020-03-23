<script>
import { setTimeout } from 'timers';
import PoolList from './List'

const isDevelopment = process.env.NODE_ENV !== 'production'

export default {
    props: {
        option_list: {
            type: Object,
            required: true
        },
        configuration: {
            type: Object,
            required: true
        },
        entry_list: {
            type: Array,
            required: true
        }
    },
    components: { PoolList },
    computed: {
        is_initial_state() {
            return !this.drawing_lot && this.draw_lot_progress == 0
        },
        is_development() {
            return isDevelopment
        }
    },
    methods: {
        updatePoolList(base_entry_list) {
            this.pool_list = []
            let temp_pool_list = []
            let current_entry_index = 0

            for (let i = 0; i < this.option_list.number_of_total_pool; i++) {
                const next_entry_index = i == this.option_list.number_of_total_pool - 1 ?
                    base_entry_list.length :
                    current_entry_index + this.option_list.number_of_entry_per_pool
                
                let entry_list = []
                
                for (let j = current_entry_index; j < next_entry_index; j++)
                    entry_list.push(base_entry_list[j])

                current_entry_index = next_entry_index

                temp_pool_list.push(entry_list)
            }

            if (this.configuration.repulse_club)
                temp_pool_list = this.repulseClub(JSON.parse(JSON.stringify(temp_pool_list)))

            this.pool_list = temp_pool_list.map((entry_list, index) => ({
                number: index + 1,
                entry_list: entry_list.map((entry, index_entry) => ({
                    number: index_entry + 1,
                    entriable_id: entry.id,
                    entriable: "Fighter",
                    entry: entry
                }))
            }))
        },
        repulseClub(pool_list) { // TODO BIG REFACTORING IN A LIBRARY
            if (!this.configuration.repulse_club) return pool_list

            console.log("START REPULSE")

            const isPoolListOk = () => { // DO WE NEED TO CONTINUE REPULSING ?
                console.log("VERIFICATION SI NOUS DEVONS CONTINUER A CHERCHER DES DOUBLONS A SEPARER")

                let club_list_matrice = {}

                pool_list.forEach((entry_list, pool_index) =>
                    entry_list.forEach((entry, entry_index) => {
                        if (undefined === club_list_matrice[entry.club]) club_list_matrice[entry.club] = {}
                        club_list_matrice[entry.club][pool_index] = (club_list_matrice[entry.club][pool_index] || 0) + 1
                    })
                )

                console.log("COMPILATION MATRICE", JSON.parse(JSON.stringify(club_list_matrice)))

                for (let club in club_list_matrice) {

                    const occurence_list = Object.values(club_list_matrice[club])
                    const is_full = occurence_list.length === pool_list.length
                    const have_duplicates = -1 !== occurence_list.findIndex(occurence_number => occurence_number > 1)

                    console.log(`Club ${club} => Poules full : ${is_full}, contient des doublons : ${have_duplicates}`)

                    if (!is_full && have_duplicates) {
                        console.log("IL RESTE DES DOUBLONS")
                        return false
                    }
                }

                console.log("TOUT EST OK !")
                return true
            }

            do { // WHILE NOT FINISH !

                let entry_duo_list = { entry1: null, entry1_index_origin: null, entry2: null, entry2_index_origin: null }
                let index_pool_origin = null

                // SEARCH 2 INDEXES TO REPULSE
                pool_loop:
                for (let index_pool = 0; index_pool < pool_list.length; index_pool++) {

                    const entry_list = pool_list[index_pool]
                    let club_list = {}

                    for (let index_entry = 0; index_entry < entry_list.length; index_entry++) {
                        const entry = entry_list[index_entry]

                        if (undefined !== club_list[entry.club] && club_list[entry.club].length > 0) {
                            entry_duo_list.entry1 = entry
                            entry_duo_list.entry1_index_origin = index_entry
                            entry_duo_list.entry2 = entry_list[club_list[entry.club][0]]
                            entry_duo_list.entry2_index_origin = club_list[entry.club][0]
                            index_pool_origin = index_pool

                            console.log("2 ENTREES SIMILAIRE TROUVEE :", entry_duo_list)

                            break pool_loop
                        }

                        if (undefined === club_list[entry.club]) club_list[entry.club] = []
                        club_list[entry.club].push(index_entry)
                    }
                }

                if (null === index_pool_origin) {
                    console.log("PLUS RIEN A SEPARER !")
                    break
                }

                console.log("PHASE DE REPULSION")

                // REPULSE INDEXES FAR AWAY !
                // ENTRY 1
                let entry_index_to_remove = null // SEARCH AN ENTRY TO SWITCH WITH
                let pool_index_found = null
                
                pool_loop:
                for (let index_pool = 0; index_pool < pool_list.length; index_pool++) { // TODO jusqu'à la moitié ?
                    const entry_list = pool_list[index_pool]
                    if (-1 !== entry_list.findIndex(entry => entry.club === entry_duo_list.entry1.club)) continue

                    for (let index_entry = 0; index_entry < entry_list.length; index_entry++) {
                        if (-1 !== pool_list[index_pool_origin].findIndex(entry => entry.club === entry_list[index_entry].club)) continue
                        entry_index_to_remove = index_entry
                        pool_index_found = index_pool
                        break pool_loop
                    }
                    console.log("Poule non disponible pour insérer l'entrée 1", JSON.parse(JSON.stringify(pool_list[index_pool])))
                }

                if (null !== entry_index_to_remove) {
                    // SWITCH ENTRY 1
                    console.log("SWITCH de l'entrée 1 avec => ", pool_list[pool_index_found][entry_index_to_remove])
                    const removed_entry_1 = pool_list[pool_index_found].splice(entry_index_to_remove, 1, entry_duo_list.entry1)[0]
                    pool_list[index_pool_origin].splice(entry_duo_list.entry1_index_origin, 1, removed_entry_1)
                }

                // ENTRY 2
                entry_index_to_remove = null // SEARCH AN ENTRY TO SWITCH WITH
                pool_index_found = null

                pool_loop:
                for (let index_pool = pool_list.length - 1; index_pool >= 0; index_pool--) { // TODO jusqu'à la moitié ?
                    const entry_list = pool_list[index_pool]
                    if (-1 !== entry_list.findIndex(entry => entry.club === entry_duo_list.entry2.club)) continue

                    entry_index_to_remove = null // SEARCH AN ENTRY TO SWITCH WITH
                    for (let index_entry = 0; index_entry < entry_list.length; index_entry++) {
                        if (-1 !== pool_list[index_pool_origin].findIndex(entry => entry.club === entry_list[index_entry].club)) continue
                        entry_index_to_remove = index_entry
                        pool_index_found = index_pool
                        break pool_loop
                    }

                    console.log("Poule non disponible pour insérer l'entrée 2", JSON.parse(JSON.stringify(pool_list[index_pool])))
                }

                if (null !== entry_index_to_remove) {
                    // SWITCH ENTRY 2
                    console.log("SWITCH de l'entrée 2 avec => ", pool_list[pool_index_found][entry_index_to_remove])
                    const removed_entry_2 = pool_list[pool_index_found].splice(entry_index_to_remove, 1, entry_duo_list.entry2)[0]
                    pool_list[index_pool_origin].splice(entry_duo_list.entry2_index_origin, 1, removed_entry_2)
                }

                
            } while (!isPoolListOk())

            console.log("END REPULSE", pool_list)
            return pool_list
        },
        shuffle() {
            this.draw_lot_progress = 0
            this.drawing_lot = true
            let shuffle_index = 0

            let promise = new Promise((resolve, reject) => {

                let shuffleInterval = setInterval(() => {
                    this.updatePoolList(this.getShuffleEntryList())
                    this.draw_lot_progress = (shuffle_index + 1) * 100 / this.nb_shuffle

                    if (++shuffle_index === this.nb_shuffle)
                    {
                        this.drawing_lot = false
                        clearInterval(shuffleInterval)
                        resolve()
                    }
                }, this.time_each_shuffle)

            })

            return promise
        },
        getShuffleEntryList() {
            let entry_list = JSON.parse(JSON.stringify(this.entry_list))

            for (let i = entry_list.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [entry_list[i], entry_list[j]] = [entry_list[j], entry_list[i]];
            }

            return entry_list
        },
        doDrawingLot() {
            this.shuffle().then(() => {
                if (this.is_development) return
                this.validate()
            })
        },
        validate() {
            this.$emit('on-validate', this.pool_list)
        }
    },
    watch: {
        option_list: {
            handler: function() {
                this.updatePoolList(this.entry_list)
            },
            deep: true,
            immediate: true
        }
    },
    data() {
        return {
            pool_list: [],
            nb_shuffle: 4,
            time_each_shuffle: 800,
            draw_lot_progress: 0,
            drawing_lot: false
        }
    }
}
</script>

<template>
    <div class="pool-list-draw">
        <div class="pool-front-actions card">
            <div class="card-body">
                <transition name="fade">
                    <div class="card-title" v-if="!is_initial_state">
                        <template v-if="drawing_lot">
                            Tirage au sort en cours...
                        </template>
                        <template v-else>
                            Tirage au sort terminé !
                        </template>
                    </div>
                </transition>

                <button v-if="is_initial_state" class="btn btn__draw btn-outline-success animated infinite pulse" @click.prevent="doDrawingLot">
                    Effectuer le tirage au sort
                </button>

                <div class="progress mb-4" v-else>
                    <div class="progress-bar bg-primary" role="progressbar" :style="{ width: draw_lot_progress+'%' }"></div>
                </div>

                <transition name="fade">
                    <div v-if="!is_initial_state && is_development" class="text-right">
                        <span class="text-warning">Visible qu'en environnement de développement</span>
                        <button class="btn btn-link" :disabled="drawing_lot" @click.prevent="shuffle()">Refaire le tirage</button>
                        <button class="btn animated" :class="{'btn-outline-success tada': !drawing_lot}" :disabled="drawing_lot" @click.prevent="validate()">Je valide ce tirage !</button>
                    </div>
                </transition>
            </div>
        </div>
        
        <pool-list :list="pool_list" :blured="is_initial_state || drawing_lot" />
    </div>
</template>

<style lang="scss">
.btn__draw {
    background-color: rgba(0,0,0,0.4);
}
</style>

<style lang="scss" scoped>
.pool-list-draw {

    .pool-front-actions {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 1;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.7);
    }

    .btn__draw {
        padding: 3.5rem 6rem;
        font-size: 2rem;
        animation-duration: 3s;
    }

    .progress {
        width: 50vw;
        height: 8px;
    }
}
</style>
