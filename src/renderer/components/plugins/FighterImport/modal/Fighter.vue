<script>
import bModal from 'bootstrap-vue/es/components/modal/modal'

const getFighterTemplate = () => ({
    name: "",
    birthdate: "",
    grade: "",
})

export default {
    components: { bModal },
    props: {
        id: {
            type: String,
            required: true
        }
    },
    computed: {
        id_modal_filter() {
            return "modal-filter__"+this.id
        },
        form_is_valid() {
            return Object.keys(this.fields).every(field => {
                return this.fields[field] && this.fields[field].valid;
            });
        }
    },
    methods: {
        show() {
            this.$refs.modalFighter.show()
        },
        closeModal() {
            this.$refs.modalFighter.hide()
        },
        apply() {
            if (!this.form_is_valid)
                return

            this.$emit('on-fighter-add', this.fighter)
            this.reset()
            this.errors.clear()
        },
        applyAndClose() {
            this.apply()
            this.closeModal()
        },
        cancel() {
            this.reset()
            this.closeModal()
            this.errors.clear()
        },
        reset() {
            this.fighter = getFighterTemplate()
        }
    },
    data() {
        return {
            fighter: getFighterTemplate()
        }
    }
}
</script>

<template>
    <b-modal class="modal__filter" title="Ajout d'un combattant" size="lg" hide-header-close ref="modalFighter">
        <div class="row">
            
            <div class="col-sm-12">
                <div class="form-group">
                    <div>
                        <label for="fighter__name">Nom *</label>
                        <input
                            id="fighter__name"
                            class="form-control"
                            type="text"
                            name="name"

                            required

                            v-validate
                            v-model="fighter.name"

                            :class="{ 'is-invalid': errors.has('name') }"
                        >
                        <i class="form-group__bar"></i>
                    </div>
                    <span class="text-danger" v-if="errors.has('name')">{{ errors.first('name') }}</span>
                </div>
            </div>

            <div class="col-sm-12">
                <div class="form-group">
                    <div>
                        <label for="fighter__birthdate">Date de naissance *</label>
                        <input
                            id="fighter__birthdate"
                            class="form-control"
                            type="text"
                            name="birthdate"
                            placeholder="Format JJ/MM/YYYY"

                            required

                            v-mask="'##/##/####'"
                            v-validate="{ date_format:'DD/MM/YYYY' }"
                            v-model="fighter.birthdate"

                            :class="{ 'is-invalid': errors.has('birthdate') }"
                        >
                        <i class="form-group__bar"></i>
                    </div>
                    <span class="text-danger" v-if="errors.has('birthdate')">{{ errors.first('birthdate') }}</span>
                </div>
            </div>

            <div class="col-sm-12">
                <div class="form-group">
                    <div>
                        <label for="fighter__grade">Grade *</label>
                        <input
                            id="fighter__grade"
                            class="form-control"
                            type="text"
                            name="grade"

                            required

                            v-validate
                            v-model="fighter.grade"

                            :class="{ 'is-invalid': errors.has('grade') }"
                        >
                        <i class="form-group__bar"></i>
                    </div>
                    <span class="text-danger" v-if="errors.has('grade')">{{ errors.first('grade') }}</span>
                </div>
            </div>

        </div>

        <template slot="modal-footer">
            <button type="button" class="btn" :disabled="!form_is_valid" :class="{'btn-outline-primary': form_is_valid}" @click.prevent="applyAndClose">Ajouter</button>
            <button type="button" class="btn" :disabled="!form_is_valid" :class="{'btn-outline-primary': form_is_valid}" @click.prevent="apply">Ajouter et saisir un nouveau combattant</button>
            <button type="button" class="btn btn-dark" @click.prevent="cancel">Annuler</button>
        </template>
    </b-modal>
</template>

<style lang="scss">
    .modal__fighter {
        .mx-input-append {
            color: #fff;
            background-color: transparent;

            svg {
                color: #fff;
            }
        }
    }
</style>
