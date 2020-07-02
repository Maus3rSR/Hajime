<script>
import { setTimeout } from 'timers';
import ListDrawLib from '@root/lib/list_draw'
import PoolList from './List'

const isDevelopment = process.env.NODE_ENV !== 'production'
const isDebugBuild = process.env.ELECTRON_WEBPACK_IS_DEBUG_BUILD

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
        },
        entriable: {
            type: String,
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
        },
        repulse_field_list() {
            let repulse_field_list = []
            
            if (this.configuration.repulse_favorite) repulse_field_list.push({ name: "is_favorite", ignore_value_list: [false] })
            if (this.configuration.repulse_club) repulse_field_list.push({ name: "club", deep: this.is_team })

            return repulse_field_list
        }
    },
    methods: {
        initDrawLib() {
            if (null === this.listDrawLib) this.listDrawLib = new ListDrawLib(isDevelopment || isDebugBuild)
        },
        buildShuffledPoolList(base_entry_list) {
            this.initDrawLib()

            let base_entry_list_shuffled = this.listDrawLib.shuffle(base_entry_list)
            let pool_list = []
            let current_entry_index = 0

            for (let i = 0; i < this.option_list.number_of_total_pool; i++) {
                const next_entry_index = i == this.option_list.number_of_total_pool - 1 ?
                    base_entry_list_shuffled.length :
                    current_entry_index + this.option_list.number_of_entry_per_pool
                
                let entry_list = []
                
                for (let j = current_entry_index; j < next_entry_index; j++)
                    entry_list.push(base_entry_list_shuffled[j])

                current_entry_index = next_entry_index

                pool_list.push(entry_list)
            }

            return this.listDrawLib.shuffle(pool_list)
        },
        updatePoolList(temp_pool_list) {
            this.pool_list = temp_pool_list.map((entry_list, index) => ({
                number: index + 1,
                entry_list: entry_list.map((entry, index_entry) => ({
                    number: index_entry + 1,
                    entriable_id: entry.id,
                    entriable: this.entriable,
                    entry: entry
                }))
            }))
        },
        shuffle() {
            this.initDrawLib()

            this.draw_lot_progress = 0
            this.drawing_lot = true
            let shuffle_index = 0
            let stop_shuffle = false

            let promise = new Promise((resolve, reject) => {

                let shuffleInterval = setInterval(() => {
                    
                    this.draw_lot_progress = (shuffle_index + 1) * 100 / this.nb_shuffle

                    if (++shuffle_index > this.nb_shuffle)
                        stop_shuffle = true

                    let temp_pool_list =  this.buildShuffledPoolList(this.entry_list)

                    if (stop_shuffle && this.repulse_field_list.length > 0)
                        try {
                            temp_pool_list = this.listDrawLib.repulse(temp_pool_list, this.repulse_field_list)
                        } catch (error) {
                            if (isDevelopment || isDebugBuild)
                                console.error(error)
                            shuffle_index--
                            stop_shuffle = false
                        }

                    this.updatePoolList(temp_pool_list)

                    if (stop_shuffle)
                    {
                        clearInterval(shuffleInterval)
                        this.drawing_lot = false
                        resolve()
                    }

                }, this.time_each_shuffle)

            })

            return promise
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
                this.updatePoolList(this.buildShuffledPoolList(this.entry_list))
            },
            deep: true,
            immediate: true
        }
    },
    data() {
        return {
            listDrawLib: null,
            pool_list: [],
            nb_shuffle: 4,
            time_each_shuffle: 800,
            draw_lot_progress: 0,
            drawing_lot: false
        }
    }
}
</script>

<i18n src="@lang/generic/common.json"></i18n>
<i18n src="@lang/screens/partials/list/pool-draw.json"></i18n>

<template>
    <div class="pool-list-draw">
        <div class="pool-front-actions card">
            <div class="card-body">
                <transition name="fade">
                    <div class="card-title" v-if="!is_initial_state">
                        <template v-if="drawing_lot">
                            {{ $t("pool-list-draw.status.ongoing") }}
                        </template>
                        <template v-else>
                            {{ $t("pool-list-draw.status.finished") }}
                        </template>
                    </div>
                </transition>

                <button v-if="is_initial_state" class="btn btn__draw btn-outline-success animated infinite pulse" @click.prevent="doDrawingLot">
                    {{ $t("pool-list-draw.launch") }}
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
