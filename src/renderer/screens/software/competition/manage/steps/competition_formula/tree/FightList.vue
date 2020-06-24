<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import FightList from '@partials/list/fight_list/Component'

export default {
    components: { FightList },
    computed: {
        ...mapState('tree', ["list"]),
        ...mapGetters({})
    },
    methods: {
        ...mapActions({}),
    },
    data() {
        return {}
    },
}
</script>

<template>
    <div class="competition__manage__tree__fight_list">

    </div>
</template>