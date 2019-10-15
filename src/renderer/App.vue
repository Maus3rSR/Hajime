<script>
import { mapState, mapActions } from 'vuex'

const { ipcRenderer } = require('electron')

export default {
    name: 'ASKC',
    computed: {
        ...mapState('database', {
            is_db_connected: "connected"
        })
    },
    methods: {
        ...mapActions({
            connectDb: "database/CONNECT",
            disconnectDb: "database/DISCONNECT"
        })
    },
    created() {
        if (undefined === this.$configuration.get('database') && !this.$route.path.includes('welcome'))
            this.$router.push('/welcome')

        if (!this.is_db_connected)
            this.connectDb().catch(() => this.$router.push('/error/db'))

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
