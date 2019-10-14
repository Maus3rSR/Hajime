<script>
import Pool from './Component'

export default {
    props: {
        list: {
            type: Array,
            required: true
        },
        entry_field: {
            type: String,
            required: false,
            default: "entry"
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
        <div class="col-lg-6 col-xl-4 list-item" v-for="pool in list" :key="pool.number">
            <pool :pool="pool" :entry_field="entry_field" :blured="blured" />
        </div>
    </transition-group>
</template>
