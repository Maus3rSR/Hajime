<script>
import { mapGetters } from 'vuex'

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
        }
    },
    computed: {
        ...mapGetters({
            color_list: "marking_board/color_list",
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
        }
    },
    methods: {
        openFightWindow(id) {
            this.$ipc.send('open-window', `fight/${parseInt(id, 10)}`)
        }
    },
    data() {
        return {
            marking_board_color_list: []
        }
    }
}
</script>

<template>
    <div>
        <data-list
            :name="name"
            title="Matchs"
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

            <template slot="fighter" slot-scope="props">
                <span class="row">
                    <div class="col text-right">{{ props.row.fighter1.name }}</div>
                    <div class="col-xs-1"><span class="badge">VS</span></div>
                    <div class="col">{{ props.row.fighter2.name }}</div>
                </span>
            </template>

            <template slot="status" slot-scope="props">
                <span class="badge badge-warning">{{ "à faire" | uppercase }}</span>
            </template>

            <template slot="action-cell" slot-scope="props">
                <button title="Gérer le match" class="btn btn-sm btn-outline-primary" @click.prevent="openFightWindow(props.row.id)">
                    <i class="zmdi zmdi-edit"></i>
                </button>
            </template>

        </data-list>
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
}
</style>