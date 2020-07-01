<script>
export default {
    props: {
        title: {
            type: String,
        },
        header: {
            type: Boolean,
            default: true
        }
    },
    components: {},
    computed: {
        modal_title() {
            return this.title || this.$t("confirmation.title")
        }
    },
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

<i18n src="@lang/generic/common.json"></i18n>
<i18n src="@lang/plugins/modal/confirmation.json"></i18n>

<template>
    <b-modal class="modal__confirmation" :title="modal_title" v-model="showModal" size="lg" hide-header-close>
        <div class="h3" v-if="header">
            <slot name="label">
                {{ $t("confirmation.subtitle") }}
            </slot>
        </div>

        <slot name="content"></slot>

        <template slot="modal-footer">
            <button type="button" class="btn btn-link" @click.prevent="cancel">{{ $t("common.action.cancel") }}</button>
            <button type="button" class="btn btn-primary" @click.prevent="confirm">{{ $t("common.action.confirm") }}</button>
        </template>
    </b-modal>
</template>

<style lang="scss">

</style>
