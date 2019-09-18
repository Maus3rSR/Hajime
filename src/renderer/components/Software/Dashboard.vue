<script>
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters({
            db_error: "db_not_connected_by_error"
        })
    },
    watch: {
        db_error(db_error) {
            if (db_error === false)
                return

            this.$router.push('/dberror')
        }
    },
}
</script>

<template>
    <div id="dashboard">
        <div class="row">
            <div class="col-sm">
                <!-- Competition -->
                <div class="card">
                    <img class="card-img" src="~@images/software/competition-bg.png">

                    <!-- <div class="card-img-overlay"> -->
                        <div class="card-body">
                            <h4 class="card-title">Compétition</h4>
                            <h6 class="card-subtitle">Gestion des compétitions</h6>

                            <!-- <p class="card-text"></p> -->

                            <router-link class="card-link" :to="{ name: 'create-competition'}">
                                <i class="zmdi zmdi-plus"></i>
                                Créer
                            </router-link>

                            <a class="card-link" href="javascript:void(0);">
                                <i class="zmdi zmdi-search"></i>
                                Chercher une compétition existante
                            </a>
                        </div>
                    </div>
                <!-- </div> -->
            </div>

            <div class="col-sm">
                <!-- Passage de grade -->
                <div class="card">
                    <img class="card-img" src="~@images/software/passage-grade-bg.png">

                    <!-- <div class="card-img-overlay"> -->
                        <div class="card-body">
                            <h4 class="card-title">Passage de grade</h4>
                            <h6 class="card-subtitle">Gestion des passages de grade</h6>

                            <!-- <p class="card-text"></p> -->

                            <a class="card-link" href="javascript:void(0);">
                                <i class="zmdi zmdi-plus"></i>
                                Créer
                            </a>
                            <a class="card-link" href="javascript:void(0);">
                                <i class="zmdi zmdi-search"></i>
                                Chercher un passage de grade existant
                            </a>
                        </div>
                    <!-- </div> -->
                </div>
            </div>
        </div>

    </div>
</template>

<style lang="scss">

</style>
