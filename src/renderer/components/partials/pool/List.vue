<script>
import Pool from './Component'

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
    components: { Pool },
    methods: {
        updatePoolList(base_entry_list) {
            this.pool_list = []
            let current_entry_index = 0;

            for (let i = 0; i < this.config.number_of_total_pool; i++) {
                const next_entry_index = i == this.config.number_of_total_pool - 1 ?
                    base_entry_list.length :
                    current_entry_index + this.config.number_of_entrant_per_pool
                
                let entry_list = []
                
                for (let j = current_entry_index; j < next_entry_index; j++)
                    entry_list.push(base_entry_list[j])

                current_entry_index = next_entry_index

                this.pool_list.push(entry_list)
            }
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
            pool_list: []
        }
    }
}
</script>

<template>
    <div>
        <transition-group name="list" tag="div" class="row">
            <div class="col-xl-3 col-lg-4 list-item" v-for="(entry_list, index) in pool_list" :key="index">
                <pool :id="index+1" :list="entry_list" />
            </div>
        </transition-group>
    </div>
</template>

<style>

</style>
