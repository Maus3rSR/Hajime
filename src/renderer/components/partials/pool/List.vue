<script>
import Pool from './Component'

export default {
    props: {
        list: {
            type: Array,
            required: true
        },
        blured: {
            type: Boolean,
            default: false
        }
    },
    components: { Pool },
    computed: {},
    methods: {},
    data() {
        return {}
    }
}
</script>

<template>
    <transition-group name="list" tag="div" class="row">
        <div class="col-xl-3 col-lg-4 list-item" v-for="(entry_list, index) in list" :key="index+'_'+entry_list.name">
            <pool :id="index+1" :list="entry_list" :blured="blured" />
        </div>
    </transition-group>
</template>
