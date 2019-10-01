<script>
import { mapGetters, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import { DateTime } from 'luxon'

export default {
    computed: {
        ...mapGetters({
            type_list: "competition/type_list",
            default_type: "competition/default_type"
        }),
        ...mapFields('competition', ['model.name', 'model.date', 'model.place', 'model.owner', 'model.type']),
        step_is_valid() {
            return !Object.keys(this.fields).some(key => this.fields[key].invalid)
        },
        competition_date: { // TODO : Need a better fix
            get() {
                if (null === this.date || undefined === this.date || this.date.length < 10)
                    return this.date
                
                const date = DateTime.fromSQL(this.date)

                return date.isValid ? date.toFormat('dd/MM/yyyy') : this.date
            },
            set(value) {
                const date = DateTime.fromFormat(value, 'dd/MM/yyyy', { locale: 'fr' })

                this.date = date.isValid ? date.toSQLDate() : value
            }
        }
    },
    mounted() {
        this.$nextTick().then(() => this.$validator.validateAll().then(() => this.errors.clear()))
    }
}
</script>

<template>
    <div>
        <div class="row">
            <div class="col-sm-12">
                <div class="form-group">
                    <div>
                        <label for="competition__name" class="card-body__title">Nom *</label>
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
                    <span class="card-body__title">Type *</span>
                    <div class="clearfix mt-3">
                        <label class="custom-control custom-radio" v-for="competition_type in type_list" :key="competition_type.value">
                            <input type="radio" name="radio-inline" :value="competition_type.value" v-model="type" class="custom-control-input">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description">{{ competition_type.name }}</span>
                        </label>
                        <i class="form-group__bar"></i>
                    </div>
                    <span class="text-danger" v-if="errors.has('type')">{{ errors.first('type') }}</span>
                </div>
            </div>

            <div class="col-sm-6">
                <div class="form-group">
                    <div>
                        <label for="competition__date" class="card-body__title">Date *</label>
                        <input
                            id="competition__date"
                            class="form-control"
                            type="text"
                            name="date"
                            placeholder="Format JJ/MM/YYYY"

                            required

                            v-mask="'##/##/####'"
                            v-validate="{ date_format:'dd/MM/yyyy' }"
                            v-model="competition_date"

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
                        <label for="competition__place" class="card-body__title">Lieu</label>
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
                        <label for="competition__owner" class="card-body__title">Organisateur</label>
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
                <button :disabled="!step_is_valid" :class="{'btn-outline-success tada': step_is_valid}" type="button" class="btn float-right animated" @click="$emit('onValidate')">
                    Etape suivante
                    <i class="zmdi zmdi-arrow-right"></i>
                </button>
            </div>
        </div>
    </div>
</template>
