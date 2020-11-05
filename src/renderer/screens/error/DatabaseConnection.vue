<script>
import { mapState, mapActions } from 'vuex'

import { setupVueI18nMessages } from '@config/i18n'
import translations from '@lang/screens/error/databaseConnection/messages'

export default {
    i18n: setupVueI18nMessages(translations),
    computed: {
        ...mapState('database', {
            is_db_connected: state => state.connected,
            is_db_connecting: state => state.is_connecting
        })
    },
    methods: {
        ...mapActions({
            connect: "database/CONNECT"
        })
    },
    watch: {
        is_db_connected(db_connected) {
            if (db_connected === false)
                return

            this.$router.push('/')
        }
    }
}
</script>

<template>
    <section id="error__db">
        <h1>
            {{ $t("common.oops") }}...
            <i class="zmdi zmdi-flash-off animated flash slower"></i>
        </h1>
        <h2>{{ $t("error-screen.db") }}</h2>

        <button class="btn btn-warning" @click.prevent="connect">
            <i v-if="!is_db_connecting" class="zmdi zmdi-flash"></i>
            <clip-loader v-else :size="'14px'" :color="'#000'"></clip-loader>
            &nbsp;{{ $t("error-screen.reconnect") }}
        </button>
    </section>
</template>

<style lang="scss">
#software {
    .content {
        &>div {
            // Pour la transition slide left/right
            transition: all .5s cubic-bezier(.55,0,.1,1);
        }
    }
}
</style>
