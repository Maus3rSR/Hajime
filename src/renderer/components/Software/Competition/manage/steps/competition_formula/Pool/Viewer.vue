<script>
import { mapState } from 'vuex'
import PoolList from '@partials/pool/List'

export default {
    components: { PoolList },
    computed: {
        ...mapState('pool', {
            list: state => state.model.pool_list
        }),
    },
    methods: {},
    data() {
        return {}
    }
}
</script>

<template>
    <div>
        <software-container limit-container="software__footer" element-scroll="poolListViewer">
            <pool-list
                id="poolListViewer"
                :list="list"
            />
        </software-container>
    </div>
</template>
