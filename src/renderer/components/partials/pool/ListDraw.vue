<script>
import PoolList from './List'
import { setTimeout } from 'timers';

export default {
    props: {
        config: {
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
        }
    },
    methods: {
        updatePoolList(base_entry_list) {
            this.pool_list = []
            let current_entry_index = 0

            for (let i = 0; i < this.config.number_of_total_pool; i++) {
                const next_entry_index = i == this.config.number_of_total_pool - 1 ?
                    base_entry_list.length :
                    current_entry_index + this.config.number_of_entry_per_pool
                
                let entry_list = []
                
                for (let j = current_entry_index; j < next_entry_index; j++)
                    entry_list.push(base_entry_list[j])

                current_entry_index = next_entry_index

                this.pool_list.push(entry_list)
            }
        },
        shuffle() {
            this.draw_lot_progress = 0
            this.drawing_lot = true
            let shuffle_index = 0

            let shuffleInterval = setInterval(() => {
                this.updatePoolList(this.getShuffleEntryList())
                this.draw_lot_progress = (shuffle_index + 1) * 100 / this.nb_shuffle

                if (++shuffle_index == this.nb_shuffle)
                {
                    this.drawing_lot = false
                    clearInterval(shuffleInterval)
                }
            }, this.time_each_shuffle)
        },
        getShuffleEntryList() {
            let entry_list = JSON.parse(JSON.stringify(this.entry_list))

            for (let i = entry_list.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [entry_list[i], entry_list[j]] = [entry_list[j], entry_list[i]];
            }

            return entry_list
        },
        validate() {
            this.$emit('on-validate', this.pool_list)
        }
    },
    watch: {
        config: {
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

                <button v-if="is_initial_state" class="btn btn__draw btn-outline-success animated infinite pulse" @click.prevent="shuffle()">
                    Effectuer le tirage au sort
                </button>

                <div class="progress mb-4" v-else>
                    <div class="progress-bar bg-primary" role="progressbar" :style="{ width: this.draw_lot_progress+'%' }"></div>
                </div>

                <transition name="fade">
                    <div v-if="!is_initial_state" class="text-right">
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
