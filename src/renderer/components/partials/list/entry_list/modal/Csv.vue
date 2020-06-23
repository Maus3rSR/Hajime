<script>
import { mapGetters } from 'vuex'
import { DateTime } from 'luxon'

export default {
    components: {},
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
            return {
                "name": {
                    label: "Nom",
                    required: true
                },
                "birthdate": {
                    label: "Date de naissance (format DD/MM/YYYY)",
                    required: true,
                    is_date: true
                },
                "license": {
                    label: "Licence",
                    required: true,
                    replace: {regex: /\s/g, value: '' },
                    validate: /^(?!\s*$).+/
                },
                ...this.competition_type == this.constant_type_list.TEAM && {
                    "team": {
                        label: "Equipe",
                        required: true
                    }
                },
                "grade": {
                    label: "Grade"
                },
                "club": {
                    label: "Club"
                }
            }
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

            this.cell_error_matrix = {}
            this.miss_required_field = false

            let list = JSON.parse(JSON.stringify(this.list))

            if (!this.import_first_line)
                list.shift()

            list = list.map((row, index) => { // Transformation
                let row_tmp = {}
                
                for (let csv_index in this.match_field_list) // Replace csv_index by fieldname in a new array
                {
                    csv_index = parseInt(csv_index, 10)

                    if (this.match_field_list[csv_index].length === 0) // default value "" of select option
                        continue

                    row_tmp[this.match_field_list[csv_index]] = {
                        value: row[csv_index],
                        csv_index: csv_index
                    }
                }

                return row_tmp
            })

            list = list.filter((row, index) => { // Validation && manipulation
            
                let row_has_error = false

                for (let field_name in this.field_list) {
                    const field = this.field_list[field_name]
                    
                    if (field.required && row[field_name] === undefined)
                    {
                        this.miss_required_field = true
                        return false
                    }

                    if (undefined === row[field_name])
                        continue

                    const row_value = row[field_name].value
                    const column_index = parseInt(row[field_name].csv_index, 10)

                    if (undefined === row_value || null === row_value)
                    {
                        if (field.required) {
                            this.setCellError(index, column_index)
                            row_has_error = true
                        }

                        continue
                    }

                    if (field.validate !== undefined && !field.validate.test(row_value))
                    {
                        this.setCellError(index, column_index)
                        row_has_error = true
                        continue
                    }

                    if (field.is_date !== undefined && field.is_date) {

                        const date = undefined === row_value.length ? { isValid: false } : DateTime.fromFormat(row_value, 'dd/mm/yyyy', { locale: 'fr' })

                        if (!date.isValid)
                        {
                            this.setCellError(index, column_index)
                            row_has_error = true
                            continue
                        }
                        
                        row[field_name].value = date.toSQLDate()
                    }

                    if (field.replace !== undefined)
                        row[field_name].value = row_value.replace(field.replace.regex, field.replace.value)
                }

                return !row_has_error
            })

            return list.map(row => {

                for (let field_name in row)
                    row[field_name] = row[field_name].value

                return row
            })
        },
        total() {
            return this.list.length - (this.import_first_line ? 0 : 1)
        },
        total_final_list() {
            return this.final_list.length
        },
        number_of_row_not_imported() {
            if (Object.keys(this.match_field_list).length == 0)
                return 0

            return this.total - this.total_final_list
        }
    },
    methods: {
        setCellError(row_index, column_index) {
            if (undefined === column_index)
                return

            row_index += (this.import_first_line ? 0 : 1)

            if (undefined === this.cell_error_matrix[row_index])
                this.cell_error_matrix[row_index] = []

            this.cell_error_matrix[row_index].push(parseInt(column_index, 10))
        },
        isRowError(row_index) {
            return undefined !== this.cell_error_matrix[row_index]
        },
        isCellError(row_index, column_index) {
            if (!this.isRowError(row_index))
                return false

            return this.cell_error_matrix[row_index].includes(column_index)
        },
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
            
        }
    },
    data() {
        return {
            list: [],
            cell_error_matrix: {},
            match_field_list: {
                "0": "name",
                "1": "birthdate",
                "2": "license",
                "3": "team" // automatically ignored by v-model in individual mode
            },
            import_first_line: false,
            miss_required_field: true,
        }
    }
}
</script>

<template>
    <b-modal scrollable class="modal__import_csv" :title="modal_title" size="xl" hide-header-close ref="previewCsvModal">
        <div class="row">
            <div class="col-sm-12">
                <transition name="fade">
                    <div class="alert alert-info" v-if="miss_required_field">
                        <div class="alert-heading">
                            <i class="zmdi zmdi-info-outline"></i>
                            Colonnes requises
                        </div>
                        Veuillez renseignez tous les champs requis par colonne en utilisant les listes déroulante
                    </div>
                    <div class="alert alert-danger" v-else-if="number_of_row_not_imported">
                        <div class="alert-heading">
                            {{number_of_row_not_imported}} ligne(s) / {{ total }} comportent des erreurs et ne seront pas importées
                        </div>
                        Veuillez vérifier votre fichier CSV que le format de chaque cellule est correct
                    </div>
                </transition>
            </div>

            <div class="col-sm-12">
                <table class="table table-hover table--preview-import-csv" v-if="list.length">
                    <tbody>
                        <tr v-for="(row, index) in preview_list" :key="'preview-row-'+index" :class="{ 'row-error': isRowError(index) }">
                            <td v-for="(item, column_index) in row" :key="'preview-item-'+column_index" :class="{ 'bg-danger': isCellError(index, column_index) }">{{ item }}</td>
                        </tr>
                    </tbody>
                    <thead>
                        <tr>
                            <th v-for="(item, index) in list[0]" :key="'preview-head-'+index">
                                <select class="form-control" v-model="match_field_list[index]">
                                    <option value=""></option>
                                    <option v-for="(field, key) in field_list" :key="key" :value="key">
                                        {{ field.label }}
                                        <template v-if="field.required">*</template></option>
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
    .table--preview-import-csv {
        tr{
            &.row-error {
                border-left: #dc3545 solid 3px;
                background-color: rgba(#dc3545, .1);
            }

            td {
                padding: 5px;
            }
        }
    }
</style>
