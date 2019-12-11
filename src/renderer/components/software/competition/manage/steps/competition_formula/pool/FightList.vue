<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
    computed: {
        ...mapState('pool', {
            list: state => state.list,
        })
    },
    methods: {},
    data() {
        return {}
    },
}
</script>

<template>
    <div>
        <transition name="fade" mode="out-in">
            <div v-if="true" class="text-center">
                <h1>Aucune données de match... :'(</h1>
            </div>

            <div v-else>

            </div>
        </transition>
    </div>
</template>

<style lang="scss" scoped>

</style>