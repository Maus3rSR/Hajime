<script>
import ModalFighter from './modal/Fighter'
import ModalPreviewCsv from './modal/Csv'
import Papa from 'papaparse'

export default {
    components: { ModalFighter, ModalPreviewCsv },
    computed: {
        total() {
            return this.list.length
        }
    },
    methods: {
        openFighterModal() {
            this.$refs.modalFighter.show()
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
            this.list.push(fighter)
            this.$notify.success("Le combattant a bien été ajouté")
        },
        onFighterListImport(fighter_list) {
            this.list = fighter_list
            this.$notify.success("La liste des combattants a bien été ajoutée")
        },
        deleteFighter(row) {
            const index = this.list.findIndex(el => el.name+el.birthdate == row.name+row.birthdate)

            if (index < 0) {
                this.$notify.error("Le combattant à supprimer n'a pas été trouvé dans la liste")
                return
            }
            
            this.list.splice(index, 1)
            this.$notify.success("Le combattant a bien été supprimé")
        }
    },
    data() {
        return {
            list: []
        }
    }
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
            :list="list"
            :total="total"
            :isDynamic="false"

            ref="FighterList"
        >
            <template slot="action-bar">

                <a
                    href="javascript:void(0)"
                    class="actions__item zmdi zmdi-plus"
                    title="Ajouter un combattant"

                    @click.prevent="openFighterModal"   
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
                
                <button title="Supprimer ce combattant de la liste" class="btn btn-sm btn-outline-danger" @click.prevent="deleteFighter(props.row)">
                    <i class="zmdi zmdi-close"></i>
                </button>

            </template>
        </data-list>

        <input type="file" ref="fighterFileInput" class="d-none" @change="previewImport">

        <modal-fighter
            id="fighter"
            ref="modalFighter"

            @on-fighter-add="onFighterAdd"
        />

        <modal-preview-csv
            id="csv-fighter-list"
            ref="previewCsvModal"

            @on-import="onFighterListImport"
        />
    </div>
</template>

<style lang="scss" scoped>

</style>
