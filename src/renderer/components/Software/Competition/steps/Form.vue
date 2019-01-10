<script>
import { mapGetters, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
    computed: {
        ...mapGetters({
            type_list: "competition_type/all",
            default_type: "competition_type/default"
        }),
        form_is_valid() {
            return Object.keys(this.fields).every(field => {
                return this.fields[field] && this.fields[field].valid;
            });
        },
        ...mapFields('competition', ['name', 'date', 'place', 'owner', 'type']),
    },
    methods: {
        ...mapActions({
            saveCompetition: "competition/SAVE_COMPETITION"
        }),
        save() {
            this.saveCompetition()
            this.$emit('onValidate')
        }
    },
    mounted() {
        this.type = this.default_type
    }
}
</script>

<template>
    <div>
        <div class="row">
            <div class="col-sm-12">
                <div class="form-group">
                    <div>
                        <label for="competition__name">Nom *</label>
                        <input
                            id="competition__name"
                            class="form-control"
                            placeholder="ex.: Compétition inter-régionales individuelle hommes"
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
                        <label for="competition__type">Type *</label>
                        <select
                            id="competition__type"
                            class="form-control"
                            name="type"

                            v-model="type"

                            :class="{ 'is-invalid': errors.has('type') }"
                        >
                            <option :value="type.value" v-for="type in type_list" :key="type.value">
                                {{ type.txt }}
                            </option>
                        </select>
                        <i class="form-group__bar"></i>
                    </div>
                    <span class="text-danger" v-if="errors.has('type')">{{ errors.first('type') }}</span>
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
                <button :disabled="!form_is_valid" :class="{'btn-outline-success': form_is_valid}" type="button" class="btn float-right" @click="save()">
                    Etape suivante
                    <i class="zmdi zmdi-arrow-right"></i>
                </button>
            </div>
        </div>
    </div>
</template>
