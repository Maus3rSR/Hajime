<script>
import { mapState, mapActions } from 'vuex'

const { ipcRenderer } = require('electron')

export default {
    name: 'ASKC',
    computed: {
        ...mapState('database', {
            is_db_connected: "connected"
        }),
        on_welcome_page() {
            return this.$route.path.includes('welcome')
        },
        redirect_to_error_db() {
            return !this.is_db_connected && !this.on_welcome_page
        },
        is_database_configuration_empty() {
            return undefined === this.$configuration.get('database')
        }
    },
    methods: {
        ...mapActions({
            connectDb: "database/CONNECT",
            disconnectDb: "database/DISCONNECT"
        })
    },
    created() {
        ipcRenderer.on('app-close', () => this.disconnectDb().then(() => ipcRenderer.send('closed')))

        if (this.is_database_configuration_empty && !this.on_welcome_page)
            this.$router.push('/welcome')
        else if (redirect_to_error_db)
            this.connectDb().catch(() => this.$router.push('/error/db'))
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
