<script>
export default {
    computed: {
        formValid () {
            return Object.keys(this.fields).every(field => {
                return this.fields[field] && this.fields[field].valid;
            });
        }
    },
    data() {
        return {
            name: null,
            date: null,
            place: null,
            owner: null
        }
    }
}
</script>

<template>
    <div id="competition__create">

        <header class="content__title">
            <h1>Nouvelle compétition</h1>

            <div class="actions">
                <router-link to="/" class="actions__item zmdi zmdi-close" title="Annuler et revenir à l'écran principal"></router-link>
            </div>
        </header>

        <div class="card">
            <div class="card-body">

                <nav aria-label="step-wizard" role="navigation">
                    <ol class="breadcrumb mb-4">
                        <li aria-current="step" class="breadcrumb-item active">1. Formulaire</li>
                        <li aria-current="step" class="breadcrumb-item">2. Import des combattants</li>
                        <li aria-current="step" class="breadcrumb-item">3. Tirage au sort</li>
                    </ol>
                </nav>

                <div class="row">
                    <div class="col-sm-6">
                        <div class="form-group">
                            <div>
                                <label for="competition__name">Nom *</label>
                                <input
                                    id="competition__name"
                                    class="form-control"
                                    placeholder="ex.: Compétition inter-régionales"
                                    type="text"
                                    name="name"

                                    required

                                    v-validate
                                    v-model="name"

                                    :class="{ 'is-invalid': errors.has('name') }"
                                >
                                <i class="form-group__bar"></i>
                            </div>
                            <span class="text-danger" v-if="errors.has('name')">{{ errors.first('name') }}</span>
                        </div>
                    </div>

                    <div class="col-sm-6">
                        <div class="form-group">
                            <div>
                                <label for="competition__date">Date *</label>
                                <input
                                    id="competition__date"
                                    class="form-control"
                                    type="text"
                                    name="date"
                                    placeholder="Format JJ/MM/YYYY"

                                    required

                                    v-mask="'##/##/####'"
                                    v-validate="{ date_format:'DD/MM/YYYY' }"
                                    v-model="date"

                                    :class="{ 'is-invalid': errors.has('date') }"
                                >
                                <i class="form-group__bar"></i>
                            </div>
                            <span class="text-danger" v-if="errors.has('date')">{{ errors.first('date') }}</span>
                        </div>
                    </div>

                    <div class="col-sm-6">
                        <div class="form-group">
                            <div>
                                <label for="competition__place">Lieu</label>
                                <input
                                    id="competition__place"
                                    class="form-control"
                                    type="text"
                                    name="place"

                                    v-model="place"

                                    :class="{ 'is-invalid': errors.has('place') }"
                                >
                                <i class="form-group__bar"></i>
                            </div>
                            <span class="text-danger" v-if="errors.has('place')">{{ errors.first('place') }}</span>
                        </div>
                    </div>

                    <div class="col-sm-6">
                        <div class="form-group">
                            <div>
                                <label for="competition__owner">Organisateur</label>
                                <input
                                    id="competition__owner"
                                    class="form-control"
                                    type="text"
                                    name="owner"

                                    v-model="owner"

                                    :class="{ 'is-invalid': errors.has('owner') }"
                                >
                                <i class="form-group__bar"></i>
                            </div>
                            <span class="text-danger" v-if="errors.has('owner')">{{ errors.first('owner') }}</span>
                        </div>
                    </div>

                </div>  

                <div class="row">
                    <div class="col">
                        <span class="text-warning text-sm">Les champs * sont requis</span>
                    </div>
                    <div class="col">
                        <button :disabled="!formValid" type="button" class="btn btn-outline-success float-right">
                            Etape suivante
                            <i class="zmdi zmdi-arrow-right"></i>
                        </button>
                    </div>
                </div>

            </div>
        </div>


    </div>
</template>

<style lang="scss">

</style>
