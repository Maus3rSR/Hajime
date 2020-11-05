<script>
import { setupVueI18nMessages } from '@config/i18n'
import translations from '@lang/plugins/modal/confirmation/messages'

export default {
    i18n: setupVueI18nMessages(translations),
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
