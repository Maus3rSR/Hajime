<script>
import bModal from 'bootstrap-vue/es/components/modal/modal'

const MODE_TYPE = {
    ADD: 'ADD',
    EDIT: 'EDIT'
}

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
            return !Object.keys(this.fields).some(key => this.fields[key].invalid)
        },
        is_edit_mode() {
            return this.mode == MODE_TYPE.EDIT
        },
        modal_title() {
            return this.is_edit_mode ? "Modification d'un combattant" : "Ajout d'un combattant"
        }
    },
    methods: {
        show(fighter) {
            if (undefined !== fighter && null !== fighter) {
                this.mode = MODE_TYPE.EDIT
                this.fighter = fighter
                this.$nextTick().then(() => this.$validator.validateAll())
            }

            this.$refs.modalFighter.show()
        },
        handleHide(event) {
            this.reset()
        },
        closeModal() {
            this.$refs.modalFighter.hide()
        },
        apply() {
            if (!this.form_is_valid)
                return

            this.$emit('on-fighter-add', this.fighter)
            this.reset()
        },
        applyEditAndClose() {
            if (!this.form_is_valid)
                return

            this.$emit('on-fighter-edit', this.fighter)
            this.closeModal()
        },
        applyAndClose() {
            this.apply()
            this.closeModal()
        },
        cancel() {
            this.closeModal()
        },
        reset() {
            this.fighter = {}
            this.mode = MODE_TYPE.ADD
            this.$nextTick().then(() => this.$validator.validateAll().then(() => this.errors.clear()))
        }
    },
    data() {
        return {
            mode: MODE_TYPE.ADD,
            fighter: {}
        }
    }
}
</script>

<template>
    <b-modal class="modal__filter" :title="modal_title" size="lg" hide-header-close ref="modalFighter" @hide="handleHide">
        <div class="row">
            
            <div class="col-sm-6">
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

            <div class="col-sm-6">
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

            <div class="col-sm-6">
                <div class="form-group">
                    <div>
                        <label for="fighter__grade">Grade</label>
                        <input
                            id="fighter__grade"
                            class="form-control"
                            type="text"
                            name="grade"

                            v-validate
                            v-model="fighter.grade"

                            :class="{ 'is-invalid': errors.has('grade') }"
                        >
                        <i class="form-group__bar"></i>
                    </div>
                    <span class="text-danger" v-if="errors.has('grade')">{{ errors.first('grade') }}</span>
                </div>
            </div>

            <div class="col-sm-6">
                <div class="form-group">
                    <div>
                        <label for="fighter__club">Club</label>
                        <input
                            id="fighter__club"
                            class="form-control"
                            type="text"
                            name="club"

                            v-validate
                            v-model="fighter.club"

                            :class="{ 'is-invalid': errors.has('club') }"
                        >
                        <i class="form-group__bar"></i>
                    </div>
                    <span class="text-danger" v-if="errors.has('club')">{{ errors.first('club') }}</span>
                </div>
            </div>

        </div>

        <template slot="modal-footer">
            <div class="mr-auto">* Champs requis</div>

            <button type="button" class="btn btn-link" @click.prevent="cancel">Annuler</button>

            <template v-if="!is_edit_mode">
                <button type="button" class="btn" :disabled="!form_is_valid" :class="{'btn-outline-primary': form_is_valid}" @click.prevent="applyAndClose">Ajouter</button>
                <button type="button" class="btn" :disabled="!form_is_valid" :class="{'btn-outline-primary': form_is_valid}" @click.prevent="apply">Ajouter et saisir un nouveau combattant</button>
            </template>
            <template v-else>
                <button type="button" class="btn" :disabled="!form_is_valid" :class="{'btn-outline-primary': form_is_valid}" @click.prevent="applyEditAndClose">Modifier</button>
            </template>
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
