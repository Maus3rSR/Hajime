<script>
export default {
    props: {
        title: {
            type: String,
            default: "Confirmation d'une action"
        }
    },
    components: {},
    computed: {},
    methods: {
        show() {
            this.showModal = true
        },
        closeModal() {
            this.showModal = false
        },
        confirm() {
            this.$emit('on-confirm')
            this.closeModal()
        },
        cancel() {
            this.closeModal()
        }
    },
    data() {
        return {
            showModal: false
        }
    }
}
</script>

<template>
    <b-modal class="modal__filter" :title="title" v-model="showModal" size="lg" hide-header-close>
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
