<script>
import { mapGetters } from 'vuex'
import FightLib from '@root/lib/fight'
import ScoreLib from '@root/lib/score'

export default {
    props: {
        list: {
            type: Array,
            required: true
        },
        is_team_mode: {
            type: Boolean,
            default: false
        },
        marking_board_reversed: {
            type: Boolean,
            default: false
        },
        index: {
            type: Number,
            default: null
        },
        team_place_number: {
            type: Number,
            default: 2
        },
        title: {
            type: String,
            default: "Matchs"
        },
    },
    computed: {
        ...mapGetters({
            color_list: "marking_board/color_list",
            getBoardId: "fight_board/getBoardId",
            isFightBoardIdLocked: "fight_board/isFightBoardLocked"
        }),
        total() {
            return this.list.length
        },
        name() {
            const name = "fight_list"
            return this.index === null ? name : `${name}_${this.index}`
        },
        left_marking_board_data() {
            return this.color_list[+this.marking_board_reversed]
        },
        right_marking_board_data() {
            return this.color_list[1 - this.marking_board_reversed]
        },
        fight_list() {
            if (!this.is_team_mode)
                return this.list

            return this.list.reduce((list, fight) => {
                fight = JSON.parse(JSON.stringify(fight))

                const team_max_length = Math.max(this.team_place_number, fight.entry1.fighter_list.length, fight.entry2.fighter_list.length)
                let children_list = []

                for (let team_number = 0; team_number < team_max_length; team_number++) {
                    if (!children_list[team_number])
                        children_list.push({
                            ...fight,
                            fighter1: null, // Simulate fighter1 in INDI mode
                            fighter2: null, // Simulate fighter2 in INDI mode
                            number: team_number, // Specific in TEAM mode
                            is_first: team_number === 0, // Specific in TEAM mode
                            is_last: team_number === team_max_length - 1 // Specific in TEAM mode
                        })

                    const fighter1 = fight.entry1.fighter_list.find(fighter => !!fighter.fight_order_list.find(fight_order => parseInt(fight_order.order, 10) === team_number))
                    const fighter2 = fight.entry2.fighter_list.find(fighter => !!fighter.fight_order_list.find(fight_order => parseInt(fight_order.order, 10) === team_number))

                    if (!!fighter1) {
                        children_list[team_number].fighter1 = fighter1
                    }
                    if (!!fighter2) children_list[team_number].fighter2 = fighter2
                }

                list.push({
                    mode: "span",
                    label: "",
                    entry1_name: fight.entry1.name,
                    entry2_name: fight.entry2.name,
                    html:  false,
                    children: children_list
                })

                return list
            }, [])
        }
    },
    methods: {
        openFightBoard(fight_row) {
            const fight_id = parseInt(fight_row.id, 10)
            const fighter1_id = parseInt(fight_row.fighter1.id, 10)
            const fighter2_id = parseInt(fight_row.fighter2.id, 10)

            let url = `fight/${fight_id}/fighter1/${fighter1_id}/fighter2/${fighter2_id}`

            if (this.marking_board_reversed)
                url += "?marking_board_reversed"

            this.$ipc.send('open-fight-board', url, this.getBoardId(fight_id, fighter1_id, fighter2_id))
        },
        isFightValid(fight_row) {
            return !!fight_row.fighter1 && !!fight_row.fighter2
        },
        isFightLocked(fight_row) {
            return FightLib.isLocked(fight_row, fight_row.fighter1, fight_row.fighter2)
        },
        isFightBoardLocked(fight_row) {
            return this.isFightValid(fight_row) && this.isFightBoardIdLocked(this.getBoardId(fight_row.id, fight_row.fighter1.id, fight_row.fighter2.id))
        },
        isFightReserve(fight_row) {
            if (!this.is_team_mode || this.is_team_mode && undefined === fight_row.number) return false
            return fight_row.number > this.team_place_number - 1
        },
        canChangeOrder(fight_row) {
            return !(!!fight_row.fighter_fight_meta_list && fight_row.fighter_fight_meta_list.length > 0)
        },
        hasComment(fight_row) {
            return !!FightLib.getComment(fight_row, fight_row.fighter1, fight_row.fighter2)
        },
        openModalComment(fight_row) {
            this.comment = FightLib.getComment(fight_row, fight_row.fighter1, fight_row.fighter2)
            this.showModal = true
        },
        openModalFightOrder(fight_row, fighter_number) {
            this.modalNewOrderFighter.fight_row = fight_row
            this.modalNewOrderFighter.fighter_number = fighter_number
            this.modalNewOrderFighter.fighter_selected = this.getFightListInModalFighterOrder()[0]
            this.$refs.modalAddFighterOrder.show()
        },
        confirmModalFighterOrder() {
            if (!this.modalNewOrderFighter.fighter_selected) {
                this.$notify.error("Impossible d'ajouter l'ordre de combat. Veuillez choisir un combattant")
                return
            }

            this.modalNewOrderFighter.fight_row[`fighter${this.modalNewOrderFighter.fighter_number}`] = this.modalNewOrderFighter.fighter_selected
            this.onFighterOrder(this.modalNewOrderFighter.fight_row, 'add', this.modalNewOrderFighter.fighter_number)
        },
        getFightListInModalFighterOrder() {
            if (!this.modalNewOrderFighter.fight_row) return []
            return this.modalNewOrderFighter.fight_row[`entry${this.modalNewOrderFighter.fighter_number}`].fighter_list
        },
        onFighterOrder(fight_row, action, fighter_number) {
            this.$emit(`on-fighter-order-${action}`, {
                fight_id: fight_row.id,
                fighter: fight_row[`fighter${fighter_number}`],
                order: fight_row.number
            })
        }
    },
    data() {
        return {
            comment: null,
            showModal: false,
            modalNewOrderFighter: {
                fight_row: null,
                fighter_selected: null,
                fighter_number: null
            }
        }
    }
}
</script>

<i18n src="@lang/generic/common.json"></i18n>
<i18n src="@lang/screens/partials/list/fight.json"></i18n>

<template>
    <div>
        <data-list
            :name="name"
            :title="title"
            class="datalist__fight"

            :list="fight_list"
            :total="total"
            :isDynamic="false"
            :sortColumn="false"
            :columns="[
                { label: 'fighter', field: 'fighter', thClass: 'fighter-column'},
                { label: $t('common.status'), field: 'status' },
                { label: '', field: 'action-cell' }
            ]"
            :groupedHeader="is_team_mode"
        >
            <template slot="header-fighter">
                <span class="row align-items-center">
                    <span class="col text-right pr-0" :class="`marking_board__color marking_board__color--${left_marking_board_data.color}`">
                        {{ left_marking_board_data.label }}
                    </span>
                    <span class="col-xs-1">
                        <a
                            @click.prevent="$emit('on-reverse-board')"

                            class="btn btn-link marking_board__btn_reverse"
                            :title="$t('fight-list.action.inverse-color')"
                        >
                            <i class="zmdi zmdi-swap"></i>
                        </a>
                    </span>
                    <span class="col pl-0" :class="`marking_board__color marking_board__color--${right_marking_board_data.color}`">
                        {{ right_marking_board_data.label }}
                    </span>
                </span>
            </template>

            <template slot="table-header-row" slot-scope="props">
                <span class="row">
                    <span class="col-sm-5 text-right">{{ props.row.entry1_name }}</span>
                    <span class="col-sm-5">{{ props.row.entry2_name }}</span>
                    <span class="col-sm-2"></span>
                </span>
            </template>

            <div slot="table-actions-bottom">
                <slot name="list-footer"></slot>
            </div>

            <template slot="footer">
                <slot name="footer"></slot>
            </template>

            <template slot="fighter" slot-scope="props">
                <span class="row">
                    <!-- FIGHTER LEFT -->
                    <div class="col text-right">
                        <span v-if="!!props.row.fighter1">

                            <span v-if="is_team_mode && canChangeOrder(props.row)" class="float-left">
                                <button v-if="!props.row.is_first" class="btn btn-sm btn-link" :title="$t('fight-list.action.fighter-up')" @click.prevent="onFighterOrder(props.row, 'up', 1)">
                                    <i class="zmdi zmdi-chevron-up zmdi-hc-lg"></i>
                                </button>
                                <button v-if="!props.row.is_last" class="btn btn-sm btn-link" :title="$t('fight-list.action.fighter-down')" @click.prevent="onFighterOrder(props.row, 'down', 1)">
                                    <i class="zmdi zmdi-chevron-down zmdi-hc-lg"></i>
                                </button>
                            </span>

                            {{ props.row.fighter1.name }}
                        </span>
                        <span v-else-if="!isFightReserve(props.row)">
                            <span class="badge badge-warning">
                                {{ $t("fight-list.empty") }}
                            </span>

                            <span class="float-left" v-if="is_team_mode && !isFightLocked(props.row)">
                                <button class="btn btn-sm btn-link" @click.prevent="openModalFightOrder(props.row, 1)">
                                    <i class="zmdi zmdi-account-add"></i>
                                    {{ $t("fight-list.action.choose") }}
                                </button>
                            </span>
                        </span>
                    </div>

                    <!-- VERSUS / SCORING -->
                    <div class="col-xs-1">
                        <span class="badge">
                            <template v-if="isFightLocked(props.row) && !!props.row.fighter1">{{ props.row.fighter1.score_given_list.length }}</template>
                            <template v-else-if="isFightLocked(props.row) && !props.row.fighter1">0</template>

                            <template v-if="isFightLocked(props.row)">-</template>
                            <span v-else-if="isFightReserve(props.row)" class="badge badge-info">
                                {{ $t("common.substitute") }}
                            </span>
                            <template v-else>VS</template>
                            
                            <template v-if="isFightLocked(props.row) && !!props.row.fighter2">{{ props.row.fighter2.score_given_list.length }}</template>
                            <template v-else-if="isFightLocked(props.row) && !props.row.fighter2">0</template>
                        </span>
                    </div>

                    <!-- FIGHTER RIGHT -->
                    <div class="col">
                        <span v-if="!!props.row.fighter2">

                            <span v-if="is_team_mode && canChangeOrder(props.row)" class="float-right">
                                <button v-if="!props.row.is_first" class="btn btn-sm btn-link" :title="$t('fight-list.action.fighter-up')" @click.prevent="onFighterOrder(props.row, 'up', 2)">
                                    <i class="zmdi zmdi-chevron-up zmdi-hc-lg"></i>
                                </button>
                                <button v-if="!props.row.is_last" class="btn btn-sm btn-link" :title="$t('fight-list.action.fighter-down')" @click.prevent="onFighterOrder(props.row, 'down', 2)">
                                    <i class="zmdi zmdi-chevron-down zmdi-hc-lg"></i>
                                </button>
                            </span>

                            {{ props.row.fighter2.name }}
                        </span>
                        <span v-else-if="!isFightReserve(props.row)">
                            <span class="badge badge-warning">
                                {{ $t("fight-list.empty") }}
                            </span>

                            <span class="float-right" v-if="is_team_mode && !isFightLocked(props.row)">
                                <button class="btn btn-sm btn-link" @click.prevent="openModalFightOrder(props.row, 2)">
                                    <i class="zmdi zmdi-account-add"></i>
                                    {{ $t("fight-list.action.choose") }}
                                </button>
                            </span>
                        </span>
                    </div>
                </span>
            </template>

            <template slot="status" slot-scope="props">
                <transition name="fade" mode="out-in">
                    <span v-if="is_team_mode && isFightReserve(props.row)"></span>
                    <span v-else-if="isFightBoardLocked(props.row) && !isFightLocked(props.row)" class="badge badge-primary animated flash slow">{{ "combat en cours" | uppercase }}</span>
                    <span v-else-if="!isFightValid(props.row) && !isFightLocked(props.row)" class="badge badge-warning">
                        <slot name="not_valid_and_locked_fight_status"></slot>
                    </span>
                    <span v-else-if="!isFightLocked(props.row)" class="badge badge-warning">{{ $t("fight-list.status.todo") | uppercase }}</span>
                    <span v-else class="badge badge-success">{{ $t("fight-list.status.finished") | uppercase }}</span>
                </transition>
            </template>

            <template slot="action-cell" slot-scope="props">

                <transition name="fade" mode="out-in">
                    <span v-if="isFightReserve(props.row) || !isFightValid(props.row) && isFightLocked(props.row)"></span>

                    <template v-else-if="!isFightValid(props.row) && !isFightLocked(props.row)" >
                        <slot name="not_valid_and_locked_fight_action" :row="props.row"></slot>
                    </template>

                    <i class="zmdi zmdi-lock" v-else-if="isFightBoardLocked(props.row)" :title="$t('fight-list.fight-screen-open')"></i>

                    <button v-else-if="!isFightLocked(props.row)" @click.prevent="openFightBoard(props.row)" :title="$t('fight-list.action.open-fight-screen')" class="btn btn-sm btn-outline-primary">
                            <i class="zmdi zmdi-open-in-browser"></i>
                    </button>

                    <button v-else @click.prevent="openFightBoard(props.row)" :title="$t('fight-list.action.see-detail')" class="btn btn-sm btn-outline-secondary">
                            <i class="zmdi zmdi-eye"></i>
                    </button>
                </transition>

                <transition name="fade" mode="out-in">
                    <button v-if="hasComment(props.row)" @click.prevent="openModalComment(props.row)" :title="$t('fight-list.action.see-comment')" class="btn btn-sm btn-outline-secondary">
                        <i class="zmdi zmdi-comment"></i>
                    </button>
                </transition>

            </template>
        </data-list>

        <b-modal :title="$t('fight-list.comment')" v-model="showModal" size="lg">
            
            <p v-if="!!comment">{{ comment.text }}</p>

            <template slot="modal-footer">
                <button type="button" class="btn btn-primary" @click.prevent="showModal = false">{{ $t("common.action.close") }}</button>
            </template>
        </b-modal>

        <modal-confirmation
            ref="modalAddFighterOrder"
            :title="$t('fight-list.modal.title')"
            :header="false"

            @on-confirm="confirmModalFighterOrder"
        >
            <template slot="content" v-if="!!modalNewOrderFighter.fight_row">

                <label class="card-body__title">
                    {{ $t("fight-list.modal.select") }}
                </label>
                <select class="form-control" v-model="modalNewOrderFighter.fighter_selected">
                    <option v-for="fighter in getFightListInModalFighterOrder()" :value="fighter" :key="fighter.id">
                        {{ fighter.name }}
                    </option>
                </select>

            </template>
        </modal-confirmation>
    </div>
</template>

<style lang="scss">
.datalist__fight {
    .vgt-row-header .row span:first-child {
        padding-right: 60px;
    }

    .fighter-column {
        .col {
            margin: 0 1rem;
        }
    }
    .marking_board__btn_reverse {
        transition: transform 0.3s ease-in-out;
        &:hover {
            transform: rotate(180deg);
        }
    }

    .btn__add-fight {
        margin: 0 auto;
        border: #fff dashed 2px;
        width: 100%;
        padding: 0;
        &:hover {
            border-color: #cecece;
        }
    }
}
</style>