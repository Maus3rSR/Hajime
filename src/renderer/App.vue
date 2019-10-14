<script>
import { mapGetters } from 'vuex'

export default {
    name: 'ASKC',
    computed: {
        ...mapGetters({
            db_error: "db_not_connected_by_error"
        })
    },
    watch: {
        db_error(db_error) {
            if (db_error === false)
                return

            this.$router.push('/dberror')
        }
    },
    created() {
        
    }
}
</script>

<template>
    <router-view></router-view>
</template>

<style lang="scss">
    /**
     * @todo Le thème pourrait être variable
     */
    @import "~@themes/default/scss/app.scss";
    @import "~@styles/transitions.scss";
</style>

<style>
    @import "~animate.css/animate.css";
</style>
