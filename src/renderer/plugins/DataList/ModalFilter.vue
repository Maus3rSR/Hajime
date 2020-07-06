<script>
import { mapGetters } from 'vuex'
import DatePicker from 'vue2-datepicker'

export default {
    components: { DatePicker },
    props: {
        id: {
            type: String,
            required: true
        },
        columns: {
            type: Array,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            active_lang: "lang/active"
        }),
        id_modal_filter() {
            return "modal-filter__"+this.id
        },
        filterableColumns() {
            return this.columns.filter(column => this.isFilterable(column))
        }
    },
    methods: {
        show() {
            this.$refs.modalFilter.show()
        },
        closeModal() {
            this.$refs.modalFilter.hide()
        },
        apply() {
            this.$emit('on-column-filter', this.columnFilters)
            this.closeModal()
        },
        reset() {
            this.columnFilters = {}
            this.apply()
        },
        isFilterable(column) {
            return 'object' === typeof column.filterOptions
                && column.filterOptions.active === true
        },
        isDateRange(column) {
            return undefined !== column.filterOptions.filterDateRangeOptions
        },
        isDropdown(column) {
            return undefined !== column.filterOptions.filterDropdownItems
                && column.filterOptions.filterDropdownItems.length > 0
        },
        isDropdownObjects(column) {
            return this.isDropdown(column)
                && typeof column.filterOptions.filterDropdownItems[0] === 'object'
        },
        isDropdownArray(column) {
            return this.isDropdown(column)
                && typeof column.filterOptions.filterDropdownItems[0] !== 'object'
        },
        getPlaceholder(column) {
            const placeholder = (this.isFilterable(column) && column.filterOptions.placeholder) || `${column.label}`
            return placeholder
        },
        getColumnField(column) {
            return typeof column.field === 'function' ? column.fieldName : column.field
        }
    },
    data() {
        return {
            columnFilters: {}
        }
    }
}
</script>

<i18n src="@lang/generic/common.json"></i18n>
<i18n src="@lang/plugins/datalist.json"></i18n>

<template>
    <b-modal class="modal__filter" title="Filtrer" size="lg" hide-header-close ref="modalFilter">
        <div class="row">
            <div class="col-sm-6" v-for="(column, index) in filterableColumns" :key="index">

                <!-- options are a list of primitives -->
                <select
                    class="form-control"
                    
                    v-if="isDropdownArray(column)"
                    v-model="columnFilters[getColumnField(column)]"
                >
                    <option value="" key="-1">{{ getPlaceholder(column) }}</option>
                    <option
                        v-for="(option, i) in column.filterOptions.filterDropdownItems"
                    
                        :key="i"
                        :value="option"
                    >
                        {{ option }}
                    </option>
                </select>

                <!-- options are a list of objects with text and value -->
                <select
                    class="form-control"

                    v-else-if="isDropdownObjects(column)"
                    v-model="columnFilters[getColumnField(column)]"
                >
                    <option value="" key="-1">{{ getPlaceholder(column) }}</option>
                    <option
                        v-for="(option, i) in column.filterOptions.filterDropdownItems"
                        :key="i"
                        :value="option.value"
                    >
                        {{ option.text }}
                    </option>
                </select>

                <date-picker
                    input-class="form-control"
                    confirm

                    v-else-if="isDateRange(column)"
                    v-model="columnFilters[getColumnField(column)]"
                    
                    :first-day-of-week="1"
                    :range="true"
                    :lang="active_lang"
                >
                </date-picker>

                <input
                    type="text"
                    class="form-control"
                    
                    v-else
                    v-model="columnFilters[getColumnField(column)]"
                    
                    :placeholder="getPlaceholder(column)"
                />

            </div>
        </div>

        <template slot="modal-footer">
            <button type="button" class="btn btn-outline-primary" @click.prevent="apply">{{ $t("common.action.filter") }}</button>
            <button type="button" class="btn btn-outline-secondary" @click.prevent="reset">{{ $t("common.action.reset") }}</button>
            <button type="button" class="btn btn-dark" @click.prevent="closeModal">{{ $t("common.action.cancel") }}</button>
        </template>
    </b-modal>
</template>

<style lang="scss">
    .modal__filter {
        .mx-input-append {
            color: #fff;
            background-color: transparent;

            svg {
                color: #fff;
            }
        }
    }
</style>
