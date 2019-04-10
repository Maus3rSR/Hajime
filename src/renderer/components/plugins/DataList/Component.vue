<script>
import Loader from 'vue-spinner/src/ClipLoader.vue'
import Counter from '../Counter/Component'
import SoftwareContainer from '../SoftwareContainer/Component'
import Pagination from './Pagination'
import RecordDisplay from './RecordDisplay'
import ModalFilter from './ModalFilter'

const 
    PER_PAGE = 20,
    LOAD_TYPE = {
        PAGE: 'PAGE',
        TABLE: 'TABLE'
    }

export default {
    components: { Loader, Pagination, RecordDisplay, ModalFilter, Counter, SoftwareContainer },
    props: {
        name: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        list: {
            type: Array,
            default() {
                return []
            }
        },
        columns: {
            type: Array,
            default() {
                return []
            }
        },
        total: {
            type: Number,
            default: 0
        },
        infiniteScrollDistance: {
            type: Number,
            default: 0
        },
        loading: {
            type: Boolean,
            default: false
        },
        fixedHeader: {
            type: Boolean,
            default: false
        },
        isDynamic: {
            type: Boolean,
            default: true
        },
        groupedHeader: {
            type: Boolean,
            default: false
        },
        hasFooter: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        id_datalist() {
            return "datalist__"+this.name
        },
        id_table() {
            return "datalist__table-container__"+this.name
        },
        id_modal_filter() {
            return "datalist__"+this.name
        },
        style_class() {
            let style_class = "table table-sm table-responsive-sm"

            if (!this.groupedHeader)
                style_class += " table-striped"

            return style_class
        },
        total_page() {
            if (this.total === 0)
                return 0
            
            return parseInt(this.total / this.serverParams.perPage, 10) || 1
        },
        is_loading_type_page() {
            return this.loading_type === LOAD_TYPE.PAGE
        },
        is_loading_type_table() {
            return this.loading_type === LOAD_TYPE.TABLE
        },
        loading_page() {
            return this.loading && this.is_loading_type_page
        },
        loading_table() {
            return this.loading && this.is_loading_type_table
        },
        current_page() {
            return this.serverParams.page
        },
        limit() {
            return this.serverParams.perPage
        },
        filter_list() {
            return this.serverParams.columnFilters
        },
        sort() {
            return this.serverParams.sort
        },
        per_page_list() {
            return [PER_PAGE, PER_PAGE * 2, PER_PAGE * 2 + PER_PAGE]
        },
        has_filter() {
            return this.columns.find(el => 'object' === typeof el.filterOptions && column.filterOptions.active === true)
        },
        mode() {
            return this.isDynamic ? "remote" : "records"
        }
    },
    methods: {
        openModal() {
            this.$refs.modalFilter.show()
        },
        changeLoadingTypeTo(type) {
            this.loading_type = type
        },
        resetState() {
            if (undefined !== this.$refs.paginator) {
                this.$refs.paginator.reset()
            }
            this.changeLoadingTypeTo(LOAD_TYPE.TABLE)
        },
        reset() {
            this.resetState()
            this.loadItems()
        },
        loadItems() {
            if (!this.isDynamic || this.loading)
                return

            this.$emit('on-load', JSON.parse(JSON.stringify({
                page: this.current_page,
                limit: this.limit,
                filter_list: this.filter_list,
                sort: this.sort
            })))
        },
        updateParams(newProps) {
            this.serverParams = Object.assign({}, this.serverParams, newProps)
        },
        onPageChange(page) {
            if (!this.isDynamic || this.loading)
                return

            this.updateParams({ page: page })
            this.loadItems()
        },
        onPageChangeReset(first_page) {
            this.updateParams({ page: first_page })
        },
        onPerPageChange(perPage) {
            if (!this.isDynamic || this.loading)
                return

            this.updateParams({ perPage: perPage })
            this.resetState()
            this.loadItems()
        },
        onSortChange(params) {
            if (!this.isDynamic || this.loading)
                return

            this.updateParams({
                sort: {
                    type: params.sortType,
                    field: this.columns[params.columnIndex].field,
                }
            })
            this.resetState()
            this.loadItems()
        },
        onColumnFilter(params) {
            this.updateParams({ columnFilters: params })
            this.resetState()
            this.loadItems()
        }
    },
    watch: {
        list: function (newList, oldList) {
            if (!this.isDynamic)
                return

            if (this.is_loading_type_page)
                this.$refs.paginator.complete()

            if (newList.length > 0 && this.current_page === 1)
                this.changeLoadingTypeTo(LOAD_TYPE.PAGE)
        },
    },
    data() {
        return {
            loading_type: LOAD_TYPE.TABLE,
            serverParams: {
                columnFilters: {},
                sort: {
                    field: "",
                    type: ""
                },
                page: 1,
                perPage: PER_PAGE
            }
        }
    },
    mounted() {
        this.loadItems()
    }
}
</script>

<template>
    <div :id="id_datalist" class="datalist">

        <software-container class="card" limit-container="software__footer" :element-scroll="id_table">

        <div class="toolbar toolbar--inner">
            <div class="toolbar__label h1">
                {{ title }}
                <span class="badge badge-pill badge-primary">
                    <counter :value="total || 0" />
                </span>
            </div>

            <div class="actions">

                <record-display
                    :name="name"
                    :display-by="per_page_list"

                    v-if="isDynamic"

                    @on-display-change="onPerPageChange"
                />

                <a
                    href="javascript:void(0)"
                    class="actions__item zmdi zmdi-settings"
                    title="Filtrer"

                    v-if="isDynamic && has_filter"

                    @click.prevent="openModal"   
                >
                </a>

                <slot name="action-bar"></slot>
            </div>
        </div>

            <div class="card-body">

                <vue-good-table
                    :id="id_table"
                    :styleClass=style_class
                    :columns="columns"
                    :rows="list"
                    :totalRows="total"
                    :isLoading="loading_table"
                    :fixed-header="fixedHeader"
                    :pagination-options="{ enabled: isDynamic && this.is_loading_type_page }"
                    :mode="mode"
                    :groupOptions="{
                        enabled: groupedHeader
                    }"

                    @on-sort-change="onSortChange"

                    infinite-wrapper
                >

                    <span class="datalist__emptystate" slot="emptystate">
                        <transition name="fade" mode="out-in" appear>
                            <span v-if="!loading">Aucune donnée :(</span>
                        </transition>
                    </span>
                    
                    <span slot="loadingContent">
                        <loader
                            color="#fff"
                            :loading="true"
                        />
                    </span>

                    <template slot="pagination-bottom">

                        <pagination
                            ref="paginator"

                            v-if="isDynamic && is_loading_type_page"
                            
                            @on-page-change="onPageChange"
                            @on-page-reset="onPageChangeReset"
                            
                            :initial-page="2"
                            :total-page="total_page"
                        />

                    </template>

                    <template slot="table-row" slot-scope="props">
                        <slot :name="props.column.field" :row="props.row">
                            {{props.formattedRow[props.column.field]}}
                        </slot>
                    </template>

                    <template slot="table-header-row" slot-scope="props">
                        <slot name="table-header-row" :row="props.row">
                            {{ props.row.label }}
                        </slot>
                    </template>

                </vue-good-table>

            </div>

            <div v-if="hasFooter" class="toolbar toolbar--inner mb-0">
                <slot name="footer"></slot>
            </div>

        </software-container>

        <modal-filter
            :id="id_modal_filter"
            :columns="columns"

            @on-column-filter="onColumnFilter"

            ref="modalFilter"
        />
    </div>
</template>

<style lang="scss" scoped>
    .datalist {
        position: relative;

        .toolbar {
            height: 3.5rem;
        }
    }

    .datalist__emptystate {
        text-align: center;
        display: block;
        font-size: 3em;
        text-shadow: 0px 0px 14px rgba(150, 150, 150, 1);
    }

    .card-body {
        .actions {
            position: static;
        }
    }
</style>

<style lang="scss">
    $loading-background-color: #000;
    $sorting-color: rgba(255, 255, 255, 0.85);

    .datalist{

        table {
            &.vgt-fixed-header {
                position: absolute;
                z-index: 10;
                /**
                 * @todo Utiliser paramétrage du theme
                 */
                background: #000;
            }

            th {
                &.sorting {
                    position: relative;
                    cursor: pointer;

                    &:after {
                        content: "";
                        display: none;
                        position: absolute;
                        height: 0;
                        width: 0;
                        right: 6px;
                        top: 50%;
                        margin-top: -3px;
                        border-left: 6px solid transparent;
                        border-right: 6px solid transparent;
                        border-bottom: 6px solid $sorting-color;
                    }

                    &.sorting-desc:after {
                        border-top: 6px solid $sorting-color;
                        border-left: 6px solid transparent;
                        border-right: 6px solid transparent;
                        border-bottom: none;
                    }

                    &.sorting-desc:after, &.sorting-asc:after, &:hover:after {
                        display: block;
                    }

                    cursor: pointer;
                }
            }

            .vgt-row-header {
                font-weight: bold;
                background-color: rgba(255, 255, 255, 0.04);
            }
        }

        .vgt-loading {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: $loading-background-color;
            opacity: 0.6;
            min-height: 50px;
        }
    }
</style>
