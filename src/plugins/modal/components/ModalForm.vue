<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from './Modal.vue'

interface Props {
    submitting?: boolean
    disabled?: boolean
}

const // Initialization
    { t } = useI18n(),
    emit = defineEmits(['submit', 'cancel']),
    // Props
    props = withDefaults(defineProps<Props>(), { submitting: false, disabled: false }),
    // Refs
    showModal = ref<boolean>(false),
    // Computed
    // Methods
    show = () => (showModal.value = true),
    close = () => {
        showModal.value = false
    },
    submit = (e: Event) => emit('submit', e),
    cancel = () => {
        emit('cancel')
        close()
    }

defineExpose({ show })
</script>

<template>
    <Modal hide-header-close class="modal-form" v-model="showModal">
        <slot></slot>

        <template #title>
            <slot name="title">{{ t('modal.form.title') }}</slot>
        </template>

        <template #footer-info>
            <i18n-t keypath="common.form.required">
                <span class="text-error">{{ t('common.form.fields') }}</span>
            </i18n-t>
        </template>

        <template #footer-action>
            <button class="btn btn-sm btn-ghost" @click="cancel">
                <slot name="cancel-btn-content">
                    {{ t('common.action.cancel') }}
                </slot>
            </button>

            <TempoButton :disabled="props.disabled">
                <button class="btn btn-sm btn-primary" @click="submit" :class="{ 'loading': submitting }">
                    <slot name="submit-btn-content">
                        {{ t('common.action.submit') }}
                    </slot>
                </button>
            </TempoButton>
        </template>
    </Modal>
</template>
