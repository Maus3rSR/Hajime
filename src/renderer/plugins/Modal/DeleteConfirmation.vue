<script>
import { setupVueI18nMessages } from '@config/i18n'
import translations from '@lang/plugins/modal/delete/messages'

export default {
    i18n: setupVueI18nMessages(translations),
    components: {},
    props: {
        labelField: {
            type: String,
        }
    },
    computed: {
        deleteLabel() {
            return undefined != this.object && undefined != this.object[this.labelField] ? this.object[this.labelField] : this.$t("confirmation-delete.element")
        }
    },
    methods: {
        show(object) {
            this.object = object
            this.$refs.deleteConfirmationModal.show()
        },
        closeModal() {
            this.$refs.deleteConfirmationModal.hide()
        },
        confirmDelete() {
            this.$emit('on-delete', this.object)
            this.object = {}
            this.closeModal()
        },
        cancel() {
            this.closeModal()
        },
    },
    data() {
        return {
            object: {}
        }
    }
}
</script>

<template>
    <b-modal class="modal__delete" :title="$t('confirmation-delete.title')" size="lg" hide-header-close ref="deleteConfirmationModal">
        <div class="h3">
            {{ $t("confirmation-delete.subtitle", { label: deleteLabel }) }}
        </div>

        <slot name="content"></slot>

        <template slot="modal-footer">
            <button type="button" class="btn btn-link" @click.prevent="cancel">{{ $t("common.action.cancel") }}</button>
            <button type="button" class="btn btn-danger" @click.prevent="confirmDelete">{{ $t("confirmation-delete.confirm") }}</button>
        </template>
    </b-modal>
</template>

<style lang="scss">

</style>
