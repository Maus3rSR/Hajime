<script>
import { mapState, mapActions } from 'vuex'

const { ipcRenderer } = require('electron')
const appVersion = require('electron').remote.app.getVersion() 

export default {
    name: 'ASKC',
    computed: {
        ...mapState('database', {
            is_db_connected: "connected"
        }),
        on_welcome_page() {
            return this.$route.path.includes('welcome')
        },
        on_app_update_page() {
            return this.$route.path.includes('app_update')
        },
        can_try_connection() {
            return !this.is_db_connected && !this.on_welcome_page
        },
        is_database_configuration_empty() {
            return undefined === this.$configuration.get('database')
        },
        is_first_entry_on_app() {
            return this.is_database_configuration_empty && !this.on_welcome_page
        },
        has_app_version() {
            return undefined !== this.$configuration.get('app_version')
        },
        is_app_version_same() {
            return this.$configuration.get('app_version') === appVersion
        },
        is_app_update_needed() {
            return !this.is_app_version_same && !this.on_app_update_page
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

        if (this.is_first_entry_on_app)
            this.$router.push('/welcome')
        else if (this.can_try_connection)
            this.connectDb().catch(() => this.$router.push('/error/db'))
    }
}
</script>

<template>
    <transition :name="fade" mode="out-in" appear>
        <router-view></router-view>
    </transition>
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
