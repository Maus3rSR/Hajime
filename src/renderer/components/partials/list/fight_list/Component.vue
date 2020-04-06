<script>
import { mapGetters } from 'vuex'
import ScoreLib from '@root/lib/score'

export default {
    props: {
        list: {
            type: Array,
            required: true
        },
        index: {
            type: Number,
            default: null
        },
        marking_board_reversed: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: "Matchs"
        }
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
        isFightTeam(fight) {
            return fight.entriable === "Team"
        },
        openModalCommentList(comment_list) {
            this.comment_list = comment_list
            this.showModal = true
        }
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

            :list="list"
            :total="total"
            :isDynamic="false"
            :sortColumn="false"
            :columns="[
                { label: 'fighter', field: 'fighter', thClass: 'fighter-column'},
                { label: 'Statut', field: 'status' },
                { label: '', field: 'action-cell' }
            ]"
        >
            <template slot="header-fighter">
                <span class="row align-items-center">
                    <span class="col text-right pr-0" :class="`marking_board__color marking_board__color--${left_marking_board_data.color}`">
                        {{ left_marking_board_data.label }}
                    </span>
                    <span class="col-xs-1">
                        <a
                            @click.prevent="$emit('makeReverse')"

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

            <div slot="table-actions-bottom">
                <slot name="list-footer"></slot>
            </div>

            <template slot="fighter" slot-scope="props">
                <span class="row">
                    <div class="col text-right">{{ props.row.entry1.name }}</div>
                    <div class="col-xs-1">
                        <span class="badge">
                            <!-- <template v-if="props.row.is_locked">{{ props.row.fighter1.score_given_list.length }}</template> -->

                            <template v-if="props.row.is_locked">-</template>
                            <template v-else>VS</template>
                            
                            <!-- <template v-if="props.row.is_locked">{{ props.row.fighter2.score_given_list.length }}</template> -->
                        </span>
                    </div>
                    <div class="col">{{ props.row.entry2.name }}</div>
                </span>
            </template>

            <template slot="status" slot-scope="props">
                <transition name="fade" mode="out-in">
                    <span v-if="isFightBoardLocked(props.row) && !props.row.is_locked" class="badge badge-primary animated flash slow">{{ "en cours d'édition" | uppercase }}</span>
                    <span v-else-if="!props.row.is_locked" class="badge badge-warning">{{ "à faire" | uppercase }}</span>
                    <span v-else class="badge badge-success">{{ "terminé" | uppercase }}</span>
                </transition>
            </template>

            <template slot="action-cell" slot-scope="props">

                <!-- TODO : Bouton tableau de marquage en team -->

                <transition name="fade" mode="out-in" v-if="!isFightTeam">
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

            </template>
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