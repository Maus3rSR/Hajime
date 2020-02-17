<script>
import { mapGetters } from 'vuex'
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
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        can_import: {
            type: Boolean,
            default: true
        },
        emit_change: {
            type: Boolean,
            default: false
        }
    },
    components: { ModalFighter, ModalPreviewCsv },
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
                        is_favorite: false,
                        children: []
                    }) - 1

                list[index].children.push(row)

                if (row.is_favorite && !list[index].is_favorite)
                    list[index].is_favorite = true

                // TODO : Si on demande à ce que la liste soit ordonnée par nom d'équipe, il faudra gérer un problème d'index lors de la suppression d'un combattant ...
                // return list.sort((a,b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0))
                return list
            }, [])
        },
        column_list() {
            let column_list = [
                { label: 'Combattant', field: 'name' },
                { label: 'N° de licence', field: 'license' },
                { label: 'Date de naissance', field: 'birthdate' },
                { label: 'Grade', field: 'grade' },
                { label: 'Club', field: 'club' },
                { label: '', field: 'action-cell' }
            ]

            if (this.is_team)
                column_list.splice(2, 0, { label: 'Equipe', field: 'team', sortable: false }) 

            if (this.make_the_call)
                column_list.splice(0, 0, { label: 'Présence', field: 'is_present', sortable: false })

            return column_list
        },
        is_team() {
            return this.competition_type == this.constant_type_list.TEAM
        },
        total() {
            return this.value.length
        }
    },
    methods: {
        updateField(object, field, value)
        {
            if (this.readonly) return false

            const index = object.originalIndex
            let list = JSON.parse(JSON.stringify(this.value))
            
            if (undefined == list[index]) {
                this.$notify.error("Le combattant n'a pas été trouvé dans la liste")
                return false
            }

            // from data-list component, remove artefacts
            delete object.originalIndex
            delete object.vgt_id

            object[field] = value
            list[index] = object

            this.$emit("input", list)

            return true
        },
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
            if (!this.can_import)
                return

            if (undefined == e.target.files[0]) {
                this.$notify.error("Une erreur est survenue lors de la lecture du fichier à importer")
                return
            }

            Papa.parse(e.target.files[0], {
                skipEmptyLines: true,
                dynamicTyping: true,
                //encoding: "UTF-8",
                complete: results => {
                    if (results.errors.length) {
                        this.$notify.error("Le fichier est invalide. Veuillez vérifier le format de votre fichier et le contenu des cellules")
                        return
                    }

                    this.$refs.previewCsvModal.show(results.data)
                }
            })
        },
        markAllPresence(is_present) {
            if (this.readonly) return

            if (this.emit_change) {
                this.$emit("on-bulk-update", {
                    id_list: this.value.map(fighter => fighter.id),
                    field_list: { is_present: is_present }
                })
                return
            }

            let list = JSON.parse(JSON.stringify(this.value))
            this.$emit("input", list.map(fighter => {
                fighter.is_present = is_present
                return fighter
            }))
        },
        markPresence(fighter, is_present)
        {
            if (this.emit_change) {
                this.$emit("on-bulk-update", {
                    id_list: [fighter.id],
                    field_list: { is_present: is_present }
                })
                return
            }

            this.updateField(fighter, "is_present", is_present)
        },
        markFavorite(fighter, is_favorite)
        {
            if (this.readonly) return false

            if (this.emit_change) {
                this.$emit("on-bulk-update", {
                    id_list: [fighter.id],
                    field_list: { is_favorite: is_favorite }
                })
                return true // @TODO à supprimer quand markTeamFavorite sera correctement géré
            }

            const updateFieldSuccess = this.updateField(fighter, "is_favorite", is_favorite)
            return updateFieldSuccess
        },
        markTeamFavorite(header_row, is_favorite) // @TODO, gérer la partie TEAM avec un champ is_favorite dans une table TEAM
        {
            if (this.readonly) return

            if (undefined == header_row.children) {
                this.$notify.error("Une erreur est survenue, il n'y a pas de combattants dans cette équipe")
                return
            }

            let success = false
            header_row.children.forEach(row => {
                if (this.markFavorite(row, is_favorite, false) && !success) // @TODO : à corriger pour être sûr que tous les combattants sont en favoris, conflit de boucle avec this.$emit('input') de updateField
                    success = true
            })

            if (success)
                this.$notify.success("L'équipe a bien été défini comme " + (is_favorite ? "favorie" : "non favorie"))
        },
        onButtonImportClick() {
            this.$refs.fighterFileInput.value = null
            this.$refs.fighterFileInput.click()
        },
        onFighterAdd(fighter) {
            if (this.readonly) return

            if (this.emit_change) {
                this.$emit('on-fighter-add', fighter)
                return
            }

            let list = JSON.parse(JSON.stringify(this.value))
            list.push(fighter)
            this.$emit("input", list)

            this.$notify.success("Le combattant a bien été ajouté")
        },
        onFighterEdit(fighter) {
            if (this.readonly) return

            if (this.emit_change) {
                this.$emit('on-fighter-edit', fighter)
                return
            }

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
            if (this.readonly) return

            if (this.emit_change) {
                this.$emit('on-fighter-delete', fighter.id)
                return
            }

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
            if (this.readonly || !this.can_import) return

            if (this.emit_change) {
                this.$emit('on-fighter-list-import', fighter_list)
                return
            }

            fighter_list = fighter_list.map(fighter => {
                fighter.is_present = false
                fighter.is_favorite = false
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
            :groupedHeader="is_team"
            :hasFooter="make_the_call"
            :isDynamic="false"
        >
            <template slot="action-bar">

                <template v-if="!readonly">
                    <a
                        href="javascript:void(0)"
                        class="actions__item zmdi zmdi-plus"
                        title="Ajouter un combattant"

                        @click.prevent="addFighter"
                    >
                    </a>

                    <a
                        v-if="can_import"

                        href="javascript:void(0)"
                        class="actions__item zmdi zmdi-download"
                        title="Importer une liste existante (fichier .CSV)"

                        @click.prevent="onButtonImportClick" 
                    >
                    </a>
                </template>

                <span v-else>
                    <i class="zmdi zmdi-lock"></i>
                    Lecture seule
                </span>
            </template>

            <template slot="table-header-row" slot-scope="props">
                <button
                    class="zmdi btn btn-sm btn-link"

                    :disabled="readonly"
                    :title="'Rendre ' + (props.row.is_favorite ? 'non favorie' : 'favorie')"
                    :class="{ 'zmdi-star text-yellow': props.row.is_favorite, 'zmdi-star-outline text-muted': !props.row.is_favorite }"

                    @click.prevent="markTeamFavorite(props.row, !props.row.is_favorite)"
                ></button>
                {{ props.row.label }}
            </template>

            <template slot="name" slot-scope="props">
                <button
                    class="zmdi btn btn-sm btn-link"
                    
                    v-if="!is_team"

                    :disabled="readonly"
                    :title="'Rendre ' + (props.row.is_favorite ? 'non favori' : 'favori')"
                    :class="{ 'zmdi-star text-yellow': props.row.is_favorite, 'zmdi-star-outline text-muted': !props.row.is_favorite }"

                    @click.prevent="markFavorite(props.row, !props.row.is_favorite)"
                ></button>
                {{ props.row.name }}
            </template>

            <template slot="birthdate" slot-scope="props">
                {{ props.row.birthdate | luxon:locale('date_short') }}
            </template>

            <template slot="is_present" slot-scope="props">
                <a
                    href="javascript:void(0)"
                    class="zmdi zmdi-hc-2x"
                    
                    v-if="!readonly"

                    :title="'Rendre ' + (props.row.is_present ? 'absent' : 'présent')"
                    :class="{ 'zmdi-mood text-success': props.row.is_present, 'zmdi-mood-bad text-danger': !props.row.is_present }"

                    @click.prevent="markPresence(props.row, !props.row.is_present)"
                ></a>

                <i
                    class="zmdi zmdi-hc-2x"
                    
                    v-else

                    :class="{ 'zmdi-mood text-success': props.row.is_present, 'zmdi-mood-bad text-danger': !props.row.is_present }"
                    :title="'Est ' + (props.row.is_present ? 'présent' : 'absent')"
                ></i>
            </template>

            <template v-if="!readonly" slot="action-cell" slot-scope="props">
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

                <span v-if="!readonly">
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