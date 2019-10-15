<script>
import { mapGetters, mapActions } from 'vuex'

const { ipcRenderer } = require('electron')

export default {
    name: 'ASKC',
    computed: {
        ...mapGetters({
            db_error: "database/not_connected_by_error"
        })
    },
    methods: {
        ...mapActions({
            disconnectDb: "database/DISCONNECT"
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
        ipcRenderer.on('app-close', () => this.disconnectDb().then(() => ipcRenderer.send('closed')))
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
