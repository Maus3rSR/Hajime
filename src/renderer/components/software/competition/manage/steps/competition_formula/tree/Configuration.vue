<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import TreeCanvas from '@partials/tree/Component'

export default {
    components: { TreeCanvas },
    props: {},
    computed: {
        ...mapState('configuration', ["COMPETITION_MINIMUM_ENTRANT","POOL_MIN_SIZE","POOL_MAX_SIZE","LAST_POOL_OFFSET"]),
        ...mapState('competition', {
            competition_id: state => state.model.id,
            competition_type: state => state.model.type,
        }),
        ...mapState('tree', {
            configuration: state => state.configuration
        }),
        ...mapGetters({
            constant_type_list: "competition/constant_type_list",
            entry_list: "competition/entry_present_list",
            saving: "tree/saving",
        }),
        // ...mapFields('pool', {}),
        count() {
            return this.entry_list.length
        },
        has_enough_entrant() {
            return this.count >= this.COMPETITION_MINIMUM_ENTRANT
        },
        is_team() {
            return this.competition_type === this.constant_type_list.TEAM
        },
        entrant_label() {
            return this.is_team ? "équipes" : "combattants"
        },
        entriable() {
            return this.is_team ? "Team" : "Fighter"
        }
    },
    methods: {
        ...mapActions({
            saveConfiguration: "tree/SAVE_CONFIGURATION",
        }),
    },
    data() {
        return {}
    }
}
</script>

<template>
    <div>
        <tree-canvas />
    </div>
</template>
