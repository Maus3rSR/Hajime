<script>
import { mapGetters } from 'vuex'
import { DateTime } from 'luxon'

const MODE_TYPE = {
    ADD: 'ADD',
    EDIT: 'EDIT'
}

export default {
    components: {},
    props: {
        id: {
            type: String,
            required: true
        },
        is_team: {
            type: Boolean,
            default: false,
        },
        team_option_list: {
            type: Array,
            default() { return [] }
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
        convertDate(date) {
            return DateTime.fromFormat(date, 'dd/MM/yyyy', { locale: 'fr' }).toSQLDate()
        },
        displayDate(date) {
            return DateTime.fromSQL(date).toFormat('dd/MM/yyyy', { locale: 'fr' })
        },
        show(fighter) {
            console.log("HEY")

            if (undefined !== fighter && null !== fighter) {
                this.mode = MODE_TYPE.EDIT
                this.fighter = fighter

                this.fighter.birthdate = this.displayDate(this.fighter.birthdate)
                this.$nextTick().then(() => this.$validator.validateAll())
            } else if (this.team_option_list.length > 0)
                this.fighter.team = this.team_option_list[0]

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

            this.fighter.birthdate = this.convertDate(this.fighter.birthdate)

            this.$emit('on-fighter-add', this.fighter)
            this.reset()
        },
        applyEditAndClose() {
            if (!this.form_is_valid)
                return

            this.fighter.birthdate = this.convertDate(this.fighter.birthdate)

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
            fighter: {
                is_present: false,
                is_favorite: false,
                team: null
            }
        }
    }
}
</script>

<template>
    <b-modal class="modal__fighter" :title="modal_title" size="lg" hide-header-close ref="modalFighter" @hide="handleHide">
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
                            v-validate="{ date_format:'dd/MM/yyyy' }"
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
                        <label for="fighter__license">N° licence *</label>
                        <input
                            id="fighter__license"
                            class="form-control"
                            type="text"
                            name="license"

                            required

                            v-validate="{ max: 16 }"
                            v-model="fighter.license"

                            :class="{ 'is-invalid': errors.has('license') }"
                        >
                        <i class="form-group__bar"></i>
                    </div>
                    <span class="text-danger" v-if="errors.has('license')">{{ errors.first('license') }}</span>
                </div>
            </div>

            <div class="col-sm-12" v-if="is_team">
                <div class="form-group">
                    <div>
                        <label for="fighter__team">Equipe *</label>
                        <select
                            id="fighter__team"
                            class="form-control"
                            type="text"
                            name="team"

                            v-model="fighter.team"

                            :class="{ 'is-invalid': errors.has('team') }"
                        >
                            <option v-for="team in team_option_list" :value="team" :key="team">{{ team }}</option>
                        </select>
                    </div>
                    <span class="text-danger" v-if="errors.has('team')">{{ errors.first('team') }}</span>
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
