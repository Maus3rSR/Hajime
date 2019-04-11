<script>
import bModal from 'bootstrap-vue/es/components/modal/modal'

export default {
    props: {
        title: {
            type: String,
            default: "Confirmation d'une action"
        }
    },
    components: { bModal },
    computed: {},
    methods: {
        show() {
            this.$refs.confirmationModal.show()
        },
        closeModal() {
            this.$refs.confirmationModal.hide()
        },
        confirm() {
            this.$emit('on-confirm')
            this.closeModal()
        },
        cancel() {
            this.closeModal()
        }
    }
}
</script>

<template>
    <b-modal class="modal__filter" :title="title" size="lg" hide-header-close ref="confirmationModal">
        <div class="h3">
            <slot name="label">
                Confirmez-vous cette action ?
            </slot>
        </div>

        <slot name="content"></slot>

        <template slot="modal-footer">
            <button type="button" class="btn btn-link" @click.prevent="cancel">Annuler</button>
            <button type="button" class="btn btn-primary" @click.prevent="confirm">Je confirme</button>
        </template>
    </b-modal>
</template>

<style lang="scss">

</style>
