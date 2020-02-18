<script>
export default {
    components: {},
    props: {
        labelField: {
            type: String,
        }
    },
    computed: {
        deleteLabel() {
            return undefined != this.object && undefined != this.object[this.labelField] ? this.object[this.labelField] : "cet élément"
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
    <b-modal class="modal__delete" title="Confirmation de suppression" size="lg" hide-header-close ref="deleteConfirmationModal">
        <div class="h3">
            Êtes-vous sûr de vouloir supprimer {{ deleteLabel }} ?
        </div>

        <template slot="modal-footer">
            <button type="button" class="btn btn-link" @click.prevent="cancel">Annuler</button>
            <button type="button" class="btn btn-danger" @click.prevent="confirmDelete">Je confirme la suppression</button>
        </template>
    </b-modal>
</template>

<style lang="scss">

</style>
