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
            return this.$route.path.includes('app/update')
        }
    },
    methods: {
        ...mapActions({
            connectDb: "database/CONNECT",
            disconnectDb: "database/DISCONNECT"
        }),
        canTryConnection() {
            return !this.isAppFirstEntry() && !this.is_db_connected
        },
        isDatabaseConfigurationEmpty() {
            return undefined === this.$configuration.get('database')
        },
        isAppFirstEntry() {
            return this.isDatabaseConfigurationEmpty()
        },
        isAppUpdateNeeded() {
            return !this.isAppFirstEntry() && !this.isAppVersionUpdated()
        },
        isAppVersionUpdated() {
            return this.$configuration.get('app_version') === appVersion
        },
        hasAppVersion() {
            return undefined !== this.$configuration.get('app_version')
        },
        check() {
            if (!this.on_app_update_page && this.isAppUpdateNeeded())
                this.$router.push('/app/update')
            
            if (!this.on_welcome_page && this.canTryConnection())
                this.connectDb().catch(() => this.$router.push('/error/db'))
        }
    },
    created() {
        ipcRenderer.on('app-close', () => this.disconnectDb().then(() => ipcRenderer.send('closed')))

        if (this.isAppFirstEntry() && !this.on_welcome_page)
            this.$router.push('/welcome')
        
        this.check()
    },
    updated() { this.check() }
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
