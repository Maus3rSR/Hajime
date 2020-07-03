<script>
import { mapState, mapActions } from 'vuex'

export default {
    computed: {
        ...mapState('configuration', ["APP_NAME"]),
        ...mapState("database", {
            is_db_connecting: "is_connecting",
        }),
        is_db_external() {
            return this.database.type === 'external'
        }
    },
    methods: {
        ...mapActions({
            test_connection: "database/TEST_CONNECTION"
        }),
        testConnexion() {
            if (!this.is_db_external)
                return

            this.test_connection(this.database).then(() => this.is_db_connected = true)
        },
        save() {
            this.$configuration.set("database", this.database)
            this.$router.push('/app/update')
        }
    },
    data() {
        return {
            is_db_connected: false,
            database: {
                type: "local",
                connection: {
                    dialect: "mariadb",
                    host: "127.0.0.1",
                    port: "3306",
                    username: "",
                    password: "",
                    database: ""
                }
            }
        }
    }
}
</script>

<i18n src="@lang/generic/common.json"></i18n>
<i18n src="@lang/screens/welcome.json"></i18n>

<template>
    <main id="welcome" class="main" data-sa-theme="1">
        <section class="welcome">
            <div class="welcome__inner">
                <h2>{{ $t("welcome.title", { app: APP_NAME }) }}</h2>
                <p>{{ $t("welcome.message") }}</p>
                <hr/>

                <div class="row">
                    <div class="col-sm-12">
                        <div class="form-group">
                            <div class="clearfix mt-3">
                                <label class="custom-control custom-radio">

                                    <input type="radio" name="database__type" value="local" v-model="database.type" class="custom-control-input">
                                    
                                    <span class="custom-control-indicator"></span>
                                    <span class="custom-control-description">{{ $t("welcome.instance.mono") }}</span>
                                </label>

                                <label class="custom-control custom-radio">

                                    <input type="radio" name="database__type" value="external" v-model="database.type" class="custom-control-input">
                                    
                                    <span class="custom-control-indicator"></span>
                                    <span class="custom-control-description">{{ $t("welcome.instance.multi") }} ({{ $t("welcome.for-user") }})</span>
                                </label>
                                <i class="form-group__bar"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <transition name="fade" mode="out-in">
                    <div class="row" v-if="database.type === 'external'">
                        <div class="col-sm-12">
                            <p></p>
                            <hr/>
                        </div>
                        <div class="col-sm-12">
                            <div class="form-group">
                                <span class="card-body__title">{{ $t("welcome.database.language") }}</span>
                                <div class="clearfix mt-3">
                                    <label class="custom-control custom-radio">

                                        <input type="radio" name="database__dialect" value="mariadb" v-model="database.connection.dialect" class="custom-control-input">
                                        
                                        <span class="custom-control-indicator"></span>
                                        <span class="custom-control-description">Mariadb</span>
                                    </label>

                                    <label class="custom-control custom-radio">

                                        <input type="radio" name="database__dialect" value="mysql" v-model="database.connection.dialect" class="custom-control-input">
                                        
                                        <span class="custom-control-indicator"></span>
                                        <span class="custom-control-description">Mysql</span>
                                    </label>
                                    <i class="form-group__bar"></i>
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-6">
                            <div class="form-group">
                                <div>
                                    <label for="database__host" class="card-body__title">{{ $t("welcome.database.server") }}</label>
                                    <input
                                        id="database__host"
                                        class="form-control"
                                        type="text"
                                        name="host"

                                        v-model="database.connection.host"
                                    >
                                    <i class="form-group__bar"></i>
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-6">
                            <div class="form-group">
                                <div>
                                    <label for="database__port" class="card-body__title">{{ $t("welcome.database.port") }}</label>
                                    <input
                                        id="database__port"
                                        class="form-control"
                                        type="text"
                                        name="port"

                                        v-model="database.connection.port"
                                    >
                                    <i class="form-group__bar"></i>
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-6">
                            <div class="form-group">
                                <div>
                                    <label for="database__username" class="card-body__title">{{ $t("welcome.database.user") }}</label>
                                    <input
                                        id="database__username"
                                        class="form-control"
                                        type="text"
                                        name="username"

                                        v-model="database.connection.username"
                                    >
                                    <i class="form-group__bar"></i>
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-6">
                            <div class="form-group">
                                <div>
                                    <label for="database__password" class="card-body__title">{{ $t("welcome.database.password") }}</label>
                                    <input
                                        id="database__password"
                                        class="form-control"
                                        type="password"
                                        name="password"

                                        v-model="database.connection.password"
                                    >
                                    <i class="form-group__bar"></i>
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-12">
                            <div class="form-group">
                                <div>
                                    <label for="database__database" class="card-body__title">{{ $t("welcome.database.dbname") }}</label>
                                    <input
                                        id="database__database"
                                        class="form-control"
                                        type="text"
                                        name="name"

                                        v-model="database.connection.database"
                                    >
                                    <i class="form-group__bar"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>

                <div class="row">
                    <div class="col">
                        <transition name="fade" mode="out-in">
                            <button class="btn btn-outline-warning text-uppercase float-right" v-if="is_db_external && !is_db_connected" @click="testConnexion">
                                <transition name="fade" mode="out-in">
                                    <i v-if="!is_db_connecting" class="zmdi zmdi-flash-off"></i>
                                    <clip-loader v-else :size="'14px'" color="#000000"></clip-loader>
                                </transition>
                                {{ $t("welcome.action.test") }}
                            </button>

                            <button v-else-if="!is_db_external || is_db_connected" class="btn btn-outline-success float-right" @click="save">
                                <i class="zmdi zmdi-check"></i>
                                {{ $t("welcome.action.save") }}
                            </button>
                        </transition>

                        <transition name="fade" mode="out-in">
                            <span v-if="is_db_external && is_db_connected" class="text-success">
                                <i class="zmdi zmdi-check" />
                                {{ $t("welcome.database.connected") }}
                            </span>
                        </transition>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<style lang="scss">
.welcome {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    height: 100vh;
    width: 100%;

    .welcome__inner {
        max-width: 800px;
        width: 100%;
        padding: 3rem;
        border-radius: 10px;
        background-color: rgba(0, 0, 0, 0.5);
    }
}
</style>