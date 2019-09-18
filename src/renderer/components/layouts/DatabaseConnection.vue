<script>
import { mapState, mapActions } from 'vuex'

export default {
    props: {
        empty_config: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapState({
            is_db_connected: state => state.db_connected,
            is_db_connecting: state => state.db_is_connecting
        })
    },
    methods: {
        ...mapActions({
            connect: "CONNECT_DATABASE"
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
    <main id="databaseConnection" class="main" data-sa-theme="1">
        <section class="error">
            <div class="error__inner">
                <h1>
                    <i class="zmdi zmdi-flash-off animated flash slower"></i>
                </h1>

                <template v-if="empty_config">
                    <h2>Aucune configuration de connexion à la base de données n'existe</h2>
                    <p>Il vous faut d'abord configurer la connexion à la base de données avant d'utilsier le logiciel</p>

                    <button title="Configurer manuellement la connexion" class="btn btn-warning" @click.prevent="/*$router.push('/')*/">
                        <i class="zmdi zmdi-arrow-right"></i>&nbsp;
                        Allez sur la page de configuration
                    </button>
                </template>

                <template v-else>
                    <h2>Une erreur de connexion à la base de données est survenue !</h2>

                    <button title="Tenter une reconnexion" class="btn btn-warning" @click.prevent="connect">
                        <i v-if="!is_db_connecting" class="zmdi zmdi-flash"></i>
                        <clip-loader v-else :size="'14px'" :color="'#000'"></clip-loader>
                        &nbsp;Tenter une reconnexion
                    </button>

                    <button title="Configurer manuellement la connexion" class="btn btn-primary" @click.prevent="$router.push('/')">
                        <i class="zmdi zmdi-arrow-right"></i>&nbsp;
                        Configurer manuellement la connexion
                    </button>

                    <button title="En cours de développement" class="btn btn-danger disabled">
                        <i class="zmdi zmdi-bug"></i>&nbsp;
                        Reporter un problème
                    </button>
                </template>
            </div>
        </section>
    </main>
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
