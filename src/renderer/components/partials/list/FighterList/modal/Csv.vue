<script>
import { mapGetters } from 'vuex'
import bModal from 'bootstrap-vue/es/components/modal/modal'
import { isArray } from 'util'

export default {
    components: { bModal },
    props: {
        id: {
            type: String,
            required: true
        },
        competition_type: {
            type: String,
            required: true,
        },
        number_of_preview: {
            type: Number,
            default: 0
        }
    },
    computed: {
        ...mapGetters({
            constant_type_list: "competition/constant_type_list"
        }),
        id_modal_filter() {
            return "modal-filter__"+this.id
        },
        can_do_import() {
            return this.total_final_list > 0
        },
        field_list() {
            let field_list = {
                "name": {
                    label: "Nom",
                    required: true
                },
                "birthdate": {
                    label: "Date de naissance (format DD/MM/YYYY)",
                    required: true,
                    validate: /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/
                },
                "license": {
                    label: "Licence",
                    required: true,
                    validate: /^(?!\s*$).+/
                },
                "grade": {
                    label: "Grade"
                },
                "club": {
                    label: "Club"
                }
            }

            if (this.competition_type == this.constant_type_list.TEAM)
                field_list["team"] = { label: "Equipe" }

            return field_list
        },
        preview_list() {
            if (!this.number_of_preview)
                return this.list

            return this.list.filter((row, index) => index <= this.number_of_preview)
        },
        modal_title() {
            return "Prévisualisation de l'import des combattants " + (this.number_of_preview ? (this.number_of_preview+" premières lignes") : "")
        },
        final_list() {
            if (Object.keys(this.match_field_list).length == 0)
                return []

            let list = JSON.parse(JSON.stringify(this.list))

            if (!this.import_first_line)
                list.shift()

            list = list.map((row, index) => { // Transformation
                let final_row = {}
                
                for (let csv_index in this.match_field_list) // Replace csv_index by fieldname in a new array
                {
                    if (this.match_field_list[csv_index].length == 0) // default value "" of select option
                        continue

                    final_row[this.match_field_list[csv_index]] = row[csv_index]
                }

                return final_row
            })

            return list.filter(row => { // Vérification
            
                for (let field_name in this.field_list) {
                    let field = this.field_list[field_name]
                    
                    if (field.required && row[field_name] == undefined)
                        return false

                    if (field.validate != undefined && row[field_name] != undefined && !field.validate.test(row[field_name]))
                        return false
                }

                return true
            })
        },
        total() {
            return this.list.length
        },
        total_final_list() {
            return this.final_list.length
        },
        number_of_row_not_imported() {
            if (Object.keys(this.match_field_list).length == 0)
                return 0

            return this.total - (this.import_first_line ? 0 : 1) - this.total_final_list
        }
    },
    methods: {
        generateKey() {
            return (new Date().getTime() + Math.floor((Math.random()*10000)+1)).toString(16)
        },
        show(data_list) {
            if (Array.isArray(data_list))
                this.list = data_list

            this.$refs.previewCsvModal.show()
        },
        closeModal() {
            this.$refs.previewCsvModal.hide()
        },
        apply() {
            if (!this.can_do_import)
                return

            this.$emit('on-import', this.final_list)
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
            this.list = []
            
        },
        showLine(index) {
            return index > 0 || index == 0 && this.import_first_line
        }
    },
    data() {
        return {
            list: [],
            match_field_list: {},
            import_first_line: true,
        }
    }
}
</script>

<template>
    <b-modal scrollable class="modal__filter" :title="modal_title" size="lg" hide-header-close ref="previewCsvModal">
        <div class="row">
            <div class="col-sm-12">
                <transition name="fade">
                    <div class="alert alert-danger" v-if="number_of_row_not_imported">
                        <div class="alert-heading">
                            {{number_of_row_not_imported}} ligne(s) comportent des erreurs et ne seront pas importées
                        </div>
                        Veuillez vérifier votre fichier CSV que le format de chaque cellule est correct
                    </div>
                </transition>
            </div>

            <div class="col-sm-12">
                <table class="table" v-if="list.length">
                    <tbody>
                        <tr v-for="(row, index) in preview_list" v-show="showLine(index)" :key="'preview-row-'+index">
                            <td v-for="(item, index) in row" :key="'preview-item-'+index">{{ item }}</td>
                        </tr>
                    </tbody>
                    <thead>
                        <tr>
                            <th v-for="(item, index) in list[0]" :key="'preview-head-'+index">
                                <select class="form-control" v-model="match_field_list[index]">
                                    <option :selected="true" value="">Choisir un champ correspondant à cette colonne</option>
                                    <option v-for="(field, key) in field_list" :key="key" :value="key">{{ field.label }} <span v-if="field.required">*</span></option>
                                </select>
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>

        <template slot="modal-footer">
            <div class="mr-auto">
                * Champs requis

                <label class="ml-2 custom-control custom-checkbox">
                    <input class="custom-control-input" type="checkbox" v-model="import_first_line">
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">Importer la 1ère ligne</span>
                </label>
            </div>
            <button type="button" class="btn btn-link" @click.prevent="cancel">Annuler</button>
            <button type="button" class="btn" :disabled="!can_do_import" :class="{'btn-outline-primary': can_do_import}" @click.prevent="applyAndClose">Importer {{ total_final_list }} combattant(s)</button>
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
