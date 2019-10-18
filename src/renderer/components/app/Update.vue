<script>
import { mapState, mapActions } from 'vuex'

export default {
    computed: {
        ...mapState("database", {
            is_db_connected: "connected",
            is_db_connecting: "is_connecting"
        }),
        is_db_already_initialized() {
            return this.$configuration.get('database.already_initialized')
        }
    },
    methods: {},
    data() {
        return {}
    }
}
</script>

<template>
    <main id="app_update" class="main" data-sa-theme="1">
        <section class="app_update">
            <div class="app_update__inner">
                <h1>
                    <span v-if="is_db_connecting">
                        Connexion...
                    </span>
                    <span v-else>
                        Application des mises à jour...
                    </span>
                </h1>
            </div>
        </section>
    </main>
</template>

<style lang="scss">
.app_update {
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    height: 100vh;
    width: 100%;

    .app_update__inner {
        max-width: 800px;
        width: 100%;
        padding: 3rem;
        border-radius: 10px;
        background-color: rgba(0, 0, 0, 0.5);
    }
}
</style>