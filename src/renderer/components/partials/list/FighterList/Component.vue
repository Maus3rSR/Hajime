<script>
import { mapGetters } from 'vuex'
import { Dropdown } from 'bootstrap-vue/es/components'; 
import ModalFighter from './modal/Fighter'
import ModalPreviewCsv from './modal/Csv'
import Papa from 'papaparse'

export default {
    props: {
        value: Array,
        competition_type: {
            type: String,
            required: false,
            default: ""
        }
    },
    components: { Dropdown, ModalFighter, ModalPreviewCsv },
    computed: {
        ...mapGetters({
            competition_type_list: "competition_type/all",
        }),
        total() {
            return this.value.length
        }
    },
    methods: {
        addFighter() {
            this.$refs.modalFighter.show()
        },
        editFighter(fighter) {
            this.$refs.modalFighter.show(JSON.parse(JSON.stringify(fighter)))
        },
        deleteFighter(fighter) {
            this.$refs.modalDeleteFighter.show(fighter)
        },
        previewImport(e) {
            if (undefined == e.target.files[0]) {
                this.$notify.error("Une erreur est survenue lors de la lecture du fichier à importer")
                return
            }

            Papa.parse(e.target.files[0], {
                skipEmptyLines: true,
                complete: results => {
                    if (results.errors.length) {
                        this.$notify.error("Le fichier est invalide. Veuillez vérifier le format de votre fichier et le contenu des cellules")
                        return
                    }

                    this.$refs.previewCsvModal.show(results.data)
                }
            })
        },
        onFighterAdd(fighter) {
            let list = JSON.parse(JSON.stringify(this.value))
            list.push(fighter)
            this.$emit("input", list)

            this.$notify.success("Le combattant a bien été ajouté")
        },
        onFighterEdit(fighter) {
            const index = fighter.originalIndex
            let list = JSON.parse(JSON.stringify(this.value))
            
            if (undefined == list[index]) {
                this.$notify.error("Le combattant à modifier n'a pas été trouvé dans la liste")
                return
            }

            // from data-list component, remove artefacts
            delete fighter.originalIndex
            delete fighter.vgt_id

            list[index] = fighter

            this.$emit("input", list)
            this.$notify.success("Le combattant a bien été modifié")
        },
        onFighterDelete(fighter) {
            let list = JSON.parse(JSON.stringify(this.value))

            if (undefined == list[fighter.originalIndex]) {
                this.$notify.error("Le combattant à supprimer n'a pas été trouvé dans la liste")
                return
            }
            
            list.splice(fighter.originalIndex, 1)
            this.$emit("input", list)

            this.$notify.success("Le combattant a bien été supprimé")
        },
        onFighterListImport(fighter_list) {
            this.$emit("input", fighter_list)
            this.$notify.success("La liste des combattants a bien été ajoutée")
        }
    },
}
</script>

<template>
    <div>
        <data-list
            
            name="fighters"
            title="Total de combattants"
            :columns="[
                { label: 'Combattant', field: 'name' },
                { label: 'Date de naissance', field: 'birthdate' },
                { label: 'Grade', field: 'grade' },
                { label: 'Club', field: 'club' },
                { label: '', field: 'action-cell' }
            ]"
            :list="value"
            :total="total"
            :isDynamic="false"

            ref="FighterList"
        >
            <template slot="action-bar">

                <!-- <b-dropdown variant="link" title="Grouper les équipes par ..." no-caret>
                    <template slot="button-content">
                        <span class="actions__item zmdi zmdi-accounts-alt"></span>
                    </template>

                    <b-dropdown-header>Grouper les équipes par :</b-dropdown-header>
                    
                    <b-dropdown-item href="#">
                        Club
                    </b-dropdown-item>
                </b-dropdown> -->

                <a
                    href="javascript:void(0)"
                    class="actions__item zmdi zmdi-plus"
                    title="Ajouter un combattant"

                    @click.prevent="addFighter"
                >
                </a>

                <a
                    href="javascript:void(0)"
                    class="actions__item zmdi zmdi-download"
                    title="Importer une liste existante (fichier .CSV)"

                    @click.prevent="$refs.fighterFileInput.click()" 
                >
                </a>

            </template>

            <template slot="action-cell" slot-scope="props">
                
                <button title="Modifier ce combattant" class="btn btn-sm btn-outline-primary" @click.prevent="editFighter(props.row)">
                    <i class="zmdi zmdi-edit"></i>
                </button>

                <button title="Supprimer ce combattant de la liste" class="btn btn-sm btn-outline-danger" @click.prevent="deleteFighter(props.row)">
                    <i class="zmdi zmdi-close"></i>
                </button>

            </template>
        </data-list>

        <input type="file" ref="fighterFileInput" class="d-none" @change="previewImport">

        <modal-fighter
            id="fighter"
            ref="modalFighter"

            @on-fighter-edit="onFighterEdit"
            @on-fighter-add="onFighterAdd"
        />

        <modal-preview-csv
            id="csv-fighter-list"
            ref="previewCsvModal"

            @on-import="onFighterListImport"
        />

        <modal-delete-confirmation
            ref="modalDeleteFighter"
            labelField="name"

            @on-delete="onFighterDelete"
        />
    </div>
</template>

<style lang="scss">
.datalist {
    .toolbar {
        .actions {
            button {
                margin: 0;
                padding: 0;
                border: none;
            }
        }
    }
}
</style>
