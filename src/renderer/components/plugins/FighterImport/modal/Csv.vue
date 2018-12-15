<script>
import bModal from 'bootstrap-vue/es/components/modal/modal'
import { isArray } from 'util';

export default {
    components: { bModal },
    props: {
        id: {
            type: String,
            required: true
        }
    },
    computed: {
        id_modal_filter() {
            return "modal-filter__"+this.id
        },
        form_is_valid() {
            return true;
        },
        total() {
            return this.list.length
        }
    },
    methods: {
        generateKey() {
            return (new Date().getTime() + Math.floor((Math.random()*10000)+1)).toString(16)
        },
        show(data_list) {
            if (Array.isArray(data_list))
                this.list = data_list

            this.$refs.previewCsvModal.show()
        },
        closeModal() {
            this.$refs.previewCsvModal.hide()
        },
        apply() {
            if (!this.form_is_valid)
                return

            this.$emit('on-import', this.list)
            this.reset()
            this.errors.clear()
        },
        applyAndClose() {
            this.apply()
            this.closeModal()
        },
        cancel() {
            this.reset()
            this.closeModal()
            this.errors.clear()
        },
        reset() {
            this.list = []
            
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
    <b-modal class="modal__filter" title="Prévisualisation de l'import des combattants" size="lg" hide-header-close ref="previewCsvModal">
        <div class="row">
            <div class="col-sm-12">

                <table class="table table-responsive table-condensed table-hover table-inverse" v-if="list.length">
                    <tbody>
                        <tr v-for="(row, index) in list" :key="'preview-row-'+index">
                            <td v-for="(item, index) in row" :key="'preview-item-'+index">{{ item }}</td>
                        </tr>
                    </tbody>
                    <thead>
                        <tr>
                            <th v-for="(item, index) in list[0]" :key="'preview-head-'+index">
                                In progress...
                            </th>
                        </tr>
                    </thead>
                </table>

            </div>
        </div>

        <template slot="modal-footer">
            <button type="button" class="btn" :disabled="!form_is_valid" :class="{'btn-outline-primary': form_is_valid}" @click.prevent="applyAndClose">Importer cette liste</button>
            <button type="button" class="btn btn-dark" @click.prevent="cancel">Annuler</button>
        </template>
    </b-modal>
</template>

<style lang="scss">
    .modal__fighter {
        .mx-input-append {
            color: #fff;
            background-color: transparent;

            svg {
                color: #fff;
            }
        }
    }
</style>
