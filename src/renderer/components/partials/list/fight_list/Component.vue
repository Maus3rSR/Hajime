<script>
import { mapGetters } from 'vuex'
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
                            fight_id: fight.id,
                            fighter1: null,
                            fighter2: null,
                            number: team_number,
                            is_first: team_number === 0,
                            is_last: team_number === team_max_length - 1
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
        openFightBoard(fight) {
            const fight_id = parseInt(fight.id, 10)
            const fighter1_id = parseInt(fight.fighter1.id, 10)
            const fighter2_id = parseInt(fight.fighter2.id, 10)

            let url = `fight/${fight_id}/fighter1/${fighter1_id}/fighter2/${fighter2_id}`

            if (this.marking_board_reversed)
                url += "?marking_board_reversed"

            this.$ipc.send('open-fight-board', url, this.getBoardId(fight_id, fighter1_id, fighter2_id))
        },
        isFightReadonly(fight) {
            return fight.is_locked
        },
        isFightBoardLocked(fight) {
            return this.isFightBoardIdLocked(this.getBoardId(fight.id, fight.fighter1.id, fight.fighter2.id))
        },
        isFightReserve(team_fight_row) {
            if (!this.is_team_mode || this.is_team_mode && undefined === team_fight_row.number) return false
            return team_fight_row.number > this.team_place_number - 1
        },
        openModalCommentList(comment_list) {
            this.comment_list = comment_list
            this.showModal = true
        },
        onFighterOrder(team_fight_row, action, fighter_number) {
            this.$emit(`on-fighter-order-${action}`, {
                fight_id: team_fight_row.fight_id,
                fighter: team_fight_row[`fighter${fighter_number}`],
                current_order: team_fight_row.number
            })
        },
    },
    data() {
        return {
            comment_list: [],
            showModal: false,
        }
    }
}
</script>

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
                { label: 'Statut', field: 'status' },
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
                            title="Inverser les couleurs"
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

            <template slot="fighter" slot-scope="props">
                <span class="row">
                    <div class="col text-right">
                        <span v-if="!!props.row.fighter1">

                            <span v-if="is_team_mode" class="float-left">
                                <button v-if="!props.row.is_first" class="btn btn-sm btn-link" title="Monter le combattant d'un niveau" @click.prevent="onFighterOrder(props.row, 'up', 1)">
                                    <i class="zmdi zmdi-chevron-up zmdi-hc-lg"></i>
                                </button>
                                <button v-if="!props.row.is_last" class="btn btn-sm btn-link" title="Descendre le combattant d'un niveau" @click.prevent="onFighterOrder(props.row, 'down', 1)">
                                    <i class="zmdi zmdi-chevron-down zmdi-hc-lg"></i>
                                </button>
                            </span>

                            {{ props.row.fighter1.name }}
                        </span>
                        <span v-else-if="!isFightReserve(props.row)">
                            <span class="badge badge-warning">
                                Aucun combattant
                            </span>

                            <span class="float-left">
                                <button class="btn btn-sm btn-link" title="Monter le combattant d'un niveau">
                                    <i class="zmdi zmdi-account-add"></i>
                                    Choisir un combattant
                                </button>
                            </span>
                        </span>
                    </div>

                    <div class="col-xs-1">
                        <span class="badge">
                            <template v-if="props.row.is_locked && !!props.row.fighter1">{{ props.row.fighter1.score_given_list.length }}</template>

                            <template v-if="props.row.is_locked">-</template>
                            <span v-else-if="isFightReserve(props.row)" class="badge badge-info">
                                Remplaçant
                            </span>
                            <template v-else>VS</template>
                            
                            <template v-if="props.row.is_locked && !!props.row.fighter2">{{ props.row.fighter2.score_given_list.length }}</template>
                        </span>
                    </div>

                    <div class="col">
                        <span v-if="!!props.row.fighter2">

                            <span v-if="is_team_mode" class="float-right">
                                <button v-if="!props.row.is_first" class="btn btn-sm btn-link" title="Monter le combattant d'un niveau" @click.prevent="onFighterOrder(props.row, 'up', 2)">
                                    <i class="zmdi zmdi-chevron-up zmdi-hc-lg"></i>
                                </button>
                                <button v-if="!props.row.is_last" class="btn btn-sm btn-link" title="Descendre le combattant d'un niveau" @click.prevent="onFighterOrder(props.row, 'down', 2)">
                                    <i class="zmdi zmdi-chevron-down zmdi-hc-lg"></i>
                                </button>
                            </span>

                            {{ props.row.fighter2.name }}
                        </span>
                        <span v-else-if="!isFightReserve(props.row)">
                            <span class="badge badge-warning">
                                Aucun combattant
                            </span>

                            <span class="float-right">
                                <button class="btn btn-sm btn-link" title="Monter le combattant d'un niveau">
                                    <i class="zmdi zmdi-account-add"></i>
                                    Choisir un combattant
                                </button>
                            </span>
                        </span>
                    </div>
                </span>
            </template>

            <!-- <template slot="status" slot-scope="props">
                <transition name="fade" mode="out-in">
                    <span v-if="isFightBoardLocked(props.row) && !props.row.is_locked" class="badge badge-primary animated flash slow">{{ "en cours d'édition" | uppercase }}</span>
                    <span v-else-if="!props.row.is_locked" class="badge badge-warning">{{ "à faire" | uppercase }}</span>
                    <span v-else class="badge badge-success">{{ "terminé" | uppercase }}</span>
                </transition>
            </template> -->

            <!-- <template slot="action-cell" slot-scope="props">

                <transition name="fade" mode="out-in">
                    <i class="zmdi zmdi-lock" v-if="isFightBoardLocked(props.row)" title="La fenêtre de gestion de combat est déjà ouverte par quelqu'un"></i>

                    <button v-else-if="!isFightReadonly(props.row)" @click.prevent="openFightBoard(props.row)" title="Ouvrir la fenêtre de gestion de combat" class="btn btn-sm btn-outline-primary">
                            <i class="zmdi zmdi-open-in-browser"></i>
                    </button>

                    <button v-else @click.prevent="openFightBoard(props.row)" title="Voir le détail du combat" class="btn btn-sm btn-outline-secondary">
                            <i class="zmdi zmdi-eye"></i>
                    </button>
                </transition>

                <transition name="fade" mode="out-in">
                    <button v-if="props.row.has_comment_list" @click.prevent="openModalCommentList(props.row.comment_list)" title="Voir les commentaires" class="btn btn-sm btn-outline-secondary">
                        <i class="zmdi zmdi-comment"></i>
                    </button>
                </transition>

            </template> -->
        </data-list>

        <b-modal title="Commentaires du combat" v-model="showModal" size="lg">
            
            <p v-for="comment in comment_list" :key="comment.id">
                {{ comment.text }}
            </p>

            <template slot="modal-footer">
                <button type="button" class="btn btn-primary" @click.prevent="showModal = false">Fermer</button>
            </template>
        </b-modal>
    </div>
</template>

<style lang="scss">
.datalist__fight {
    .vgt-row-header .row span:first-child {
        margin-right: 4rem;
        padding-right: 0;
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