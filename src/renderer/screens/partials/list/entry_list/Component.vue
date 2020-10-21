<script>
import { mapGetters } from 'vuex'
import path from 'path'
import Papa from 'papaparse'
import ModalFighter from './modal/Fighter'
import ModalPreviewCsv from './modal/Csv'

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
            present_count: "competition/entry_present_count",
            missing_count: "competition/entry_missing_count",
            is_all_present: "competition/is_all_entry_present",
            is_all_missing: "competition/is_all_entry_missing",
        }),
        list() {
            if (!this.is_team)
                return this.value

            return this.value.reduce((list, team) => {
                list.push({
                    mode: "span",
                    label: team.name,
                    html: false,
                    children: team.fighter_list,
                    ...team
                })

                // TODO : Si on demande à ce que la liste soit ordonnée par nom d'équipe, il faudra gérer un problème d'index lors de la suppression d'un combattant ...
                // return list.sort((a,b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0))
                return list
            }, [])
        },
        column_list() {
            let column_list = [
                { label: this.$t("common.fighter"), field: "name" },
                { label: this.$t("common.of.number", { item: this.$options.filters.lowercase(this.$t("common.license")) }), field: "license" },
                { label: this.$t("common.date-birth"), field: "birthdate" },
                { label: this.$t("common.grade"), field: "grade" },
                { label: this.$t("common.club"), field: "club" },
                { label: "", field: "action-cell" }
            ]

            if (this.make_the_call)
                column_list.splice(0, 0, { label: this.$t("common.presence"), field: "is_present", sortable: false })

            return column_list
        },
        is_team() {
            return this.competition_type === this.constant_type_list.TEAM
        },
        total() {
            return !this.is_team ? this.value.length : this.value.reduce((count, entry) => count += entry.fighter_list.length, 0)
        },
        team_list() {
            return this.is_team ? this.list.map(team => ({
                id: !!team.id ? parseInt(team.id, 10) : team.name,
                name: team.name
            })) : []
        }
    },
    methods: {
        updateField(object, field, value)
        {
            if (this.readonly) return false

            const index = object.originalIndex
            let list = JSON.parse(JSON.stringify(this.value))
            
            if (undefined === list[index]) {
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
        updateTeamField(object, field, value)
        {
            if (this.readonly) return false

            const index = object.vgt_header_id
            let list = JSON.parse(JSON.stringify(this.value))
            
            if (undefined === list[index]) {
                this.$notify.error("L'équipe n'a pas été trouvé dans la liste")
                return false
            }

            // from data-list component, remove artefacts
            delete object.children
            delete object.html
            delete object.label
            delete object.mode
            delete object.vgt_header_id
            delete object.vgt_header_id

            object[field] = value
            list[index] = object

            this.$emit("input", list)

            return true
        },
        insertFighterToTeamList(team_list, team_name, fighter) {
            let team_index = team_list.findIndex(team => team.name === team_name)

            if (-1 === team_index)
                team_list.push({ is_favorite: false, name: team_name, fighter_list: [fighter] })
            else
                team_list[team_index].fighter_list.push(fighter)

            return team_list
        },
        deleteFighterFromTeamList(team_list, fighter_index) {
            let index_loop = 0
            for (let i = 0; i < team_list.length; i++) {
                for (let j = 0; j < team_list[i].fighter_list.length; j++) {
                    if (index_loop === fighter_index) {
                        team_list[i].fighter_list.splice(j, 1)

                        if (team_list[i].fighter_list.length === 0)
                            team_list.splice(i, 1)

                        return true
                    }
                    index_loop++
                }
            }

            return false
        },
        updateFighterFromTeamList(team_list, fighter_index, fighter) {
            const team_name = fighter.team_id
            let index_loop = 0

            for (let i = 0; i < team_list.length; i++) {
                for (let j = 0; j < team_list[i].fighter_list.length; j++) {
                    if (index_loop === fighter_index) {
                        if (team_list[i].name === team_name)
                            team_list[i].fighter_list[j] = fighter
                        else { // In this case it's the team name which was updated => switch it to the new team
                            team_list[i].fighter_list.splice(j, 1)
                            this.insertFighterToTeamList(team_list, team_name, fighter)

                            if (team_list[i].fighter_list.length === 0)
                                team_list.splice(i, 1)
                        }
                        return true
                    }
                    index_loop++
                }
            }

            return false
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
        downloadCsvSample() {
            this.$shell.openItem(path.join(__static, `/import-sample${this.is_team ? '-team' : ''}.csv`));
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
                let id_list = []

                if (this.is_team)
                    this.value.forEach(entry => id_list = [...id_list, ...entry.fighter_list.map(fighter => fighter.id)])
                else
                    id_list = this.value.map(fighter => fighter.id)

                this.$emit("on-bulk-update", {
                    id_list,
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
                return
            }

            this.updateField(fighter, "is_favorite", is_favorite)
        },
        markTeamFavorite(team, is_favorite)
        {
            if (this.readonly) return

            if (this.emit_change) {
                this.$emit("on-bulk-update", {
                    id_list: [team.id],
                    field_list: { is_favorite: is_favorite },
                    is_team_field: true
                })
                return
            }

            this.updateTeamField(team, "is_favorite", is_favorite)
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
            
            if (!this.is_team)
                list.push(fighter)
            else {
                const team_name = fighter.team_id
                this.insertFighterToTeamList(list, team_name, fighter) // array is passed by reference
            }

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

            // from data-list component, remove artefacts
            delete fighter.originalIndex
            delete fighter.vgt_id

            if (!this.is_team && !!list[index])
                list[index] = fighter
            else if (!this.is_team && !list[index] || !this.updateFighterFromTeamList(list, index, fighter))
                return this.$notify.error("Le combattant à modifier n'a pas été trouvé")

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
            const index = fighter.originalIndex

            if (!this.is_team && !!list[index])
                list.splice(index, 1)
            else if (!this.is_team && !list[index] || !this.deleteFighterFromTeamList(list, index))
                return this.$notify.error("Le combattant à supprimer n'a pas été trouvé dans la liste")

            this.$emit("input", list)
            this.$notify.success("Le combattant a bien été supprimé")
        },
        onFighterListImport(entry_list) {
            if (this.readonly || !this.can_import) return

            if (this.emit_change) {
                this.$emit('on-fighter-list-import', entry_list)
                return
            }

            entry_list = entry_list.map(fighter => {
                fighter.is_present = false
                fighter.is_favorite = false
                return fighter
            })

            if (this.is_team)
                entry_list = entry_list.reduce((new_entry_list, fighter) => {
                    let index = new_entry_list.findIndex(team => team.name === fighter.team)

                    if (-1 === index)
                        index = new_entry_list.push({ is_favorite: false, name: fighter.team, fighter_list: [] }) - 1

                    new_entry_list[index].fighter_list.push(fighter)

                    return new_entry_list
                }, [])

            this.$emit("input", entry_list)
            this.$notify.success("La liste des combattants a bien été ajoutée")
        }
    },
}
</script>

<i18n src="@lang/generic/common.json"></i18n>
<i18n src="@lang/screens/partials/list/entry.json"></i18n>

<template>
    <div>
        <data-list
            name="fighters"
            :title="$t('common.of.total', { item: $t('common.fighters') }) | lowercase | capitalize({ onlyFirstLetter: true })"
            ref="FighterList"

            :columns="column_list"
            :list="list"
            :total="total"
            :groupedHeader="is_team"
            :isDynamic="false"
        >
            <template slot="action-bar">

                <template v-if="!readonly">
                    <a
                        href="javascript:void(0)"
                        class="actions__item zmdi zmdi-plus"
                        :title="$t('entry-list.action.add')"

                        @click.prevent="addFighter"
                    >
                    </a>

                    <a
                        v-if="can_import"

                        href="javascript:void(0)"
                        class="actions__item zmdi zmdi-upload"
                        :title="$t('entry-list.action.upload')"

                        @click.prevent="onButtonImportClick" 
                    >
                    </a>

                    <a
                        v-if="can_import"

                        href="javascript:void(0)"
                        class="actions__item btn-link zmdi zmdi-download"
                        :title="$t('entry-list.action.download')"

                        @click.prevent="downloadCsvSample" 
                    >
                    </a>
                </template>

                <span v-else>
                    <i class="zmdi zmdi-lock"></i>
                    {{ $t("common.readonly") }}
                </span>
            </template>

            <template slot="table-header-row" slot-scope="props">
                <button
                    class="zmdi btn btn-sm btn-link"

                    :disabled="readonly"
                    :title="$t('common.action.set', { adjective: $t(props.row.is_favorite ? 'entry-list.unfavorite-team' : 'entry-list.favorite-team') }) | lowercase | capitalize({ onlyFirstLetter: true })"
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
                    :title="$t('common.action.set', { adjective: $t(props.row.is_favorite ? 'entry-list.unfavorite-fighter' : 'entry-list.favorite-fighter') }) | lowercase | capitalize({ onlyFirstLetter: true })"
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

                    :title="$t('common.action.set', { adjective: $t(props.row.is_present ? 'entry-list.missing' : 'entry-list.present') }) | lowercase | capitalize({ onlyFirstLetter: true })"
                    :class="{ 'zmdi-mood text-success': props.row.is_present, 'zmdi-mood-bad text-danger': !props.row.is_present }"

                    @click.prevent="markPresence(props.row, !props.row.is_present)"
                ></a>

                <i
                    class="zmdi zmdi-hc-2x"
                    
                    v-else

                    :class="{ 'zmdi-mood text-success': props.row.is_present, 'zmdi-mood-bad text-danger': !props.row.is_present }"
                    :title="$t(props.row.is_present ? 'entry-list.is-present' : 'entry-list.is-missing')"
                ></i>
            </template>

            <template v-if="!readonly" slot="action-cell" slot-scope="props">
                <button :title="$t('entry-list.action.edit')" class="btn btn-sm btn-outline-primary" @click.prevent="editFighter(props.row)">
                    <i class="zmdi zmdi-edit"></i>
                </button>

                <button :title="$t('entry-list.action.delete')" class="btn btn-sm btn-outline-danger" @click.prevent="deleteFighter(props.row)">
                    <i class="zmdi zmdi-close"></i>
                </button>
            </template>

            <template slot="footer" v-if="make_the_call">
                <span class="toolbar__label d-none d-sm-inline">
                    <template>
                        {{ $t('entry-list.present') }}&nbsp;
                        <span class="badge badge-pill" :class="{ 'badge-success': is_all_present, 'badge-primary': !is_all_present }">
                            <counter :value="present_count" /> / <counter :value="total" />
                        </span>
                    </template>
                    
                    <transition name="fade" mode="out-in">
                        <span v-if="!is_all_present">
                            / {{ $t('entry-list.missing') }}&nbsp;
                            <span class="badge badge-pill badge-danger">
                                <counter :value="missing_count" /> / <counter :value="total" />
                            </span>
                        </span>
                    </transition>
                </span>

                <span v-if="!readonly">
                    <a href="javascript:void(0)" class="btn btn-link" @click.prevent="markAllPresence(true)">
                        <i class="text-success zmdi zmdi-mood"></i>
                        {{ $t('entry-list.present-all') }}
                    </a>
                    <a href="javascript:void(0)" class="btn btn-link" @click.prevent="markAllPresence(false)">
                        <i class="text-danger zmdi zmdi-mood-bad"></i>
                        {{ $t('entry-list.missing-all') }}
                    </a>
                </span>
            </template>
        </data-list>

        <input type="file" ref="fighterFileInput" class="d-none" @change="previewImport">

        <modal-fighter
            id="fighter"
            ref="modalFighter"

            :is_team="is_team"
            :team_option_list="team_list"

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