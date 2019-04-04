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
            required: true,
        },
        make_the_call: {
            type: Boolean,
            value: false
        }
    },
    components: { Dropdown, ModalFighter, ModalPreviewCsv },
    computed: {
        ...mapGetters({
            constant_type_list: "competition/constant_type_list",
            present_count: "competition/fighter_present_count",
            missing_count: "competition/fighter_missing_count",
            is_all_present: "competition/is_all_fighter_present",
            is_all_missing: "competition/is_all_fighter_missing",
        }),
        list() {
            if (this.competition_type != this.constant_type_list.TEAM)
                return this.value

            return this.value.reduce((list, row) => {
                let index = list.findIndex(el => el.label == row.team)

                if (index == -1)
                    index = list.push({
                        mode: "span",
                        label: row.team,
                        html: false,
                        children: []
                    }) - 1

                list[index].children.push(row)

                // TODO : Si on demande à ce que la liste soit ordonnée par nom d'équipe, il faudra gérer un problème d'index lors de la suppression d'un combattant ...
                // return list.sort((a,b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0))
                return list
            }, [])
        },
        column_list() {
            let column_list = [
                { label: 'Combattant', field: 'name' },
                { label: 'Date de naissance', field: 'birthdate' },
                { label: 'Grade', field: 'grade' },
                { label: 'Club', field: 'club' },
                { label: '', field: 'action-cell' }
            ]

            if (this.competition_type == this.constant_type_list.TEAM)
                column_list.splice(2, 0, { label: 'Equipe', field: 'team', sortable: false }) 

            if (this.make_the_call)
                column_list.splice(0, 0, { label: 'Présence', field: 'is_present', sortable: false })

            return column_list
        },
        grouped_header() {
            return this.competition_type == this.constant_type_list.TEAM
        },
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
        markAllPresence(is_present) {
            let list = JSON.parse(JSON.stringify(this.value))
            this.$emit("input", list.map(fighter => {
                fighter.is_present = is_present
                return fighter
            }))

            this.$notify.success("Tous les combatants ont été définis comme " + (is_present ? "présents" : "absents"))
        },
        markPresence(fighter, is_present)
        {
            const index = fighter.originalIndex
            let list = JSON.parse(JSON.stringify(this.value))
            
            if (undefined == list[index]) {
                this.$notify.error("Le combattant n'a pas été trouvé dans la liste")
                return
            }

            // from data-list component, remove artefacts
            delete fighter.originalIndex
            delete fighter.vgt_id

            fighter.is_present = is_present
            list[index] = fighter

            this.$emit("input", list)
            this.$notify.success("Le combattant a bien été défini comme " + (is_present ? "présent" : "absent"))
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
            fighter_list = fighter_list.map(fighter => {
                fighter.is_present = false
                return fighter
            })
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
            ref="FighterList"

            :columns="column_list"
            :list="list"
            :total="total"
            :groupedHeader="grouped_header"
            :hasFooter="make_the_call"
            :isDynamic="false"
        >
            <template slot="action-bar">

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

            <template slot="is_present" slot-scope="props">
                <a href="javascript:void(0)" @click.prevent="markPresence(props.row, false)" v-if="props.row.is_present" class="text-success zmdi zmdi-hc-2x zmdi-mood" title="Rendre absent"></a>
                <a href="javascript:void(0)" @click.prevent="markPresence(props.row, true)" v-else class="text-danger zmdi zmdi-hc-2x zmdi-mood-bad" title="Rendre présent"></a>
            </template>

            <template slot="action-cell" slot-scope="props">
                <button title="Modifier ce combattant" class="btn btn-sm btn-outline-primary" @click.prevent="editFighter(props.row)">
                    <i class="zmdi zmdi-edit"></i>
                </button>

                <button title="Supprimer ce combattant de la liste" class="btn btn-sm btn-outline-danger" @click.prevent="deleteFighter(props.row)">
                    <i class="zmdi zmdi-close"></i>
                </button>
            </template>

            <template slot="footer">
                <span class="toolbar__label d-none d-sm-inline">
                    <template>
                        Présent&nbsp;
                        <span class="badge badge-pill" :class="{ 'badge-success': is_all_present, 'badge-primary': !is_all_present }">
                            <counter :value="present_count" /> / <counter :value="total" />
                        </span>
                    </template>
                    
                    <transition name="fade" mode="out-in">
                        <span v-if="!is_all_present">
                            / Absent&nbsp;
                            <span class="badge badge-pill badge-danger">
                                <counter :value="missing_count" /> / <counter :value="total" />
                            </span>
                        </span>
                    </transition>
                </span>

                <span>
                    <a href="javascript:void(0)" class="btn btn-link" @click.prevent="markAllPresence(true)">
                        <i class="text-success zmdi zmdi-mood"></i>
                        Tous présent
                    </a>
                    <a href="javascript:void(0)" class="btn btn-link" @click.prevent="markAllPresence(false)">
                        <i class="text-danger zmdi zmdi-mood-bad"></i>
                        Tous absent
                    </a>
                </span>
            </template>
        </data-list>

        <input type="file" ref="fighterFileInput" class="d-none" @change="previewImport">

        <modal-fighter
            id="fighter"
            ref="modalFighter"

            :competition_type="competition_type"

            @on-fighter-edit="onFighterEdit"
            @on-fighter-add="onFighterAdd"
        />

        <modal-preview-csv
            id="csv-fighter-list"
            ref="previewCsvModal"

            :competition_type="competition_type"

            @on-import="onFighterListImport"
        />

        <modal-delete-confirmation
            ref="modalDeleteFighter"
            labelField="name"

            @on-delete="onFighterDelete"
        />
    </div>
</template>