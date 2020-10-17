<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
    computed: {
        ...mapState("database", {
            is_db_connected: "connected",
            is_db_connecting: "is_connecting"
        }),
        ...mapState("database/migration", {
            migration_initialized: "initialized",
            migrating: "migrating",
            migration_error: "error",
        }),
        ...mapGetters({
            migrationOn: "database/migration/on",
            getPending: "database/migration/pending",
            getExecuted: "database/migration/executed"
        }),
        applied_migration_percent() {
            return this.applied_migration / this.migration_pending * 100
        }
    },
    methods: {
        ...mapActions({
            ignore_migration: "database/migration/IGNORE_MIGRATION",
            migrate: "database/migration/MIGRATE"
        }),
        validate() {
            this.$configuration.set("app_version", this.$app.version)
            this.$router.push('/')
        }
    },
    watch: {
        migration_initialized: {
            handler: function(init) {
                if (!init || this.migrating)
                    return

                this.migration_pending = this.getPending()
                this.migration_executed = this.getExecuted()
                this.migrationOn("migrating", () => this.applied_migration++)

                if (this.migration_pending === 0) {
                    this.validate()
                    return
                }

                this.migrate().then(this.validate)
            },
            deep: true,
            immediate: true
        }
    },
    data() {
        return {
            applied_migration: 0,
            migration_pending: 0,
            migration_executed: 0,
        }
    }
}
</script>

<i18n src="@lang/generic/common.json"></i18n>
<i18n src="@lang/screens/app/update.json"></i18n>

<template>
    <main id="app_update" class="main" data-sa-theme="1">
        <section class="app_update">
            <div class="app_update__inner">
                <transition name="fade" mode="out-in" appear>
                    <span v-if="!migration_error">
                        <h1 v-if="is_db_connecting">{{ $t("app-update.connection") }}...</h1>
                        <h1 v-else>
                            {{ $t("app-update.updating") }}...
                            <span v-if="migration_pending">
                                {{ applied_migration }} / {{ migration_pending }}
                            </span>
                        </h1>
                        <clip-loader color="#ffffff"></clip-loader>

                        <div class="progress mb-4" v-if="migration_pending">
                            <div class="progress-bar bg-primary" role="progressbar" :style="{ width: applied_migration_percent+'%' }"></div>
                        </div>
                    </span>
                    <span v-else>
                        <h1>{{ $t("common.oops") }}... :-(</h1>
                        <h2>{{ $t("app-update.error") }}</h2>
                    </span>
                </transition>
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