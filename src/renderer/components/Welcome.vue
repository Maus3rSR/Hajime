<script>
export default {
    data() {
        return {
            database: {
                type: "local",
                dialect: "mariadb",
                host: "127.0.0.1",
                port: "3306",
                username: "",
                password: "",
                name: ""
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
                <p>C'est la première fois que tu utilises cette application, il faut que tu nous indiques comment nous gérerons les données</p>

                <div class="row">
                    <div class="col-sm-12">
                        <div class="form-group">
                            <span class="card-body__title">Type de base de données</span>
                            <div class="clearfix mt-3">
                                <label class="custom-control custom-radio">

                                    <input type="radio" name="radio-inline" value="local" v-model="database.type" class="custom-control-input">
                                    
                                    <span class="custom-control-indicator"></span>
                                    <span class="custom-control-description">Locale</span>
                                </label>

                                <label class="custom-control custom-radio">

                                    <input type="radio" name="radio-inline" value="external" v-model="database.type" class="custom-control-input">
                                    
                                    <span class="custom-control-indicator"></span>
                                    <span class="custom-control-description">Externe (Mysql, Mariadb)</span>
                                </label>
                                <i class="form-group__bar"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <transition name="fade" mode="out-in">
                    <div class="row" v-if="database.type === 'external'">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <div>
                                    <label for="database__host" class="card-body__title">Serveur</label>
                                    <input
                                        id="database__host"
                                        class="form-control"
                                        type="text"
                                        name="host"

                                        v-model="database.host"
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

                                        v-model="database.port"
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

                                        v-model="database.username"
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
                                        type="text"
                                        name="password"

                                        v-model="database.password"
                                    >
                                    <i class="form-group__bar"></i>
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-12">
                            <div class="form-group">
                                <div>
                                    <label for="database__name" class="card-body__title">Nom de la base de données</label>
                                    <input
                                        id="database__name"
                                        class="form-control"
                                        type="text"
                                        name="name"

                                        v-model="database.name"
                                    >
                                    <i class="form-group__bar"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>

                <div class="row text-center">
                    <div class="col">
                        <button class="btn btn-btn-lg btn-outline-warning text-uppercase">
                            <i class="zmdi zmdi-hc-2x zmdi-flash-off"></i><br/>
                            Tester la connexion
                        </button>
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