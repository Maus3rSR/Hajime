<script>
import { mapState, mapActions } from 'vuex'

export default {
    computed: {
        ...mapState("database", {
            is_db_connected: "connected",
            is_db_connecting: "is_connecting",
            db_error: "error"
        }),
        is_db_external() {
            return this.database.type === 'external'
        }
    },
    methods: {
        ...mapActions({
            connect: "database/CONNECT"
        }),
        testConnexion() {
            if (!this.is_db_external)
                return

            this.connect(this.database)
        },
        save() {
            this.$configuration.set("database", this.database)
            this.$router.push('/')
        }
    },
    data() {
        return {
            database: {
                type: "local",
                already_initialized: false,
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

<template>
    <main id="welcome" class="main" data-sa-theme="1">
        <section class="welcome">
            <div class="welcome__inner">
                <h2>Bienvenue sur le logiciel ASKC, Kenshi</h2>
                <p>C'est la première fois que tu utilises cette application, il faut que tu nous indiques comment fonctionnera le logiciel</p>
                <hr/>

                <div class="row">
                    <div class="col-sm-12">
                        <div class="form-group">
                            <div class="clearfix mt-3">
                                <label class="custom-control custom-radio">

                                    <input type="radio" name="database__type" value="local" v-model="database.type" class="custom-control-input">
                                    
                                    <span class="custom-control-indicator"></span>
                                    <span class="custom-control-description">Mono-instance</span>
                                </label>

                                <label class="custom-control custom-radio">

                                    <input type="radio" name="database__type" value="external" v-model="database.type" class="custom-control-input">
                                    
                                    <span class="custom-control-indicator"></span>
                                    <span class="custom-control-description">Multi-instance (pour utilisateurs avancés)</span>
                                </label>
                                <i class="form-group__bar"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <transition name="fade" mode="out-in">
                    <div class="row" v-if="database.type === 'external'">
                        <div class="col-sm-12">
                            <p>Dans le cas d'une utilisation multi-instance, tu dois nous indiquer où aller chercher les données</p>
                            <hr/>
                        </div>
                        <div class="col-sm-12">
                            <div class="form-group">
                                <span class="card-body__title">
                                    <span class="badge badge-danger">IMPORTANT</span>
                                    La base de données a déjà été initialisée par une autre instance du logiciel
                                </span>
                                <div class="clearfix mt-3">
                                    <label class="custom-control custom-radio">
                                        <input type="radio" name="database__already_initialized" value="false" v-model="database.already_initialized" class="custom-control-input">
                                        
                                        <span class="custom-control-indicator"></span>
                                        <span class="custom-control-description">Non</span>
                                    </label>

                                    <label class="custom-control custom-radio">
                                        <input type="radio" name="database__already_initialized" value="true" v-model="database.already_initialized" class="custom-control-input">
                                        
                                        <span class="custom-control-indicator"></span>
                                        <span class="custom-control-description">Oui</span>
                                    </label>
                                    <i class="form-group__bar"></i>
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-12">
                            <div class="form-group">
                                <span class="card-body__title">Langage</span>
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
                                    <label for="database__host" class="card-body__title">Serveur</label>
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
                                    <label for="database__port" class="card-body__title">Port</label>
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
                                    <label for="database__username" class="card-body__title">Nom d'utilisateur</label>
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
                                    <label for="database__password" class="card-body__title">Mot de passe</label>
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
                                    <label for="database__database" class="card-body__title">Nom de la base de données</label>
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
                                Tester la connexion
                            </button>

                            <button v-else-if="!is_db_external || is_db_connected" class="btn btn-outline-success float-right" @click="save">
                                <i class="zmdi zmdi-check"></i>
                                Sauvegarder les paramètres et commencer
                            </button>
                        </transition>

                        <transition name="fade" mode="out-in">
                            <span v-if="is_db_external && is_db_connected" class="text-success">
                                <i class="zmdi zmdi-check" />
                                La connexion à la base de données a pu être établie
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