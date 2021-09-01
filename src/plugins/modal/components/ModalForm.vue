<script setup lang="ts">
import { ref, reactive, readonly, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from './Modal.vue'

const // Initialization
    { t } = useI18n(),
    emit = defineEmits(['submit', 'cancel']),
    // Refs
    showModal = ref<boolean>(false),
    // Computed
    // Methods
    show = () => (showModal.value = true),
    close = () => {
        showModal.value = false
    },
    submit = () => emit('submit'),
    cancel = () => {
        emit('cancel')
        close()
    }

defineExpose({ show })
</script>

<template>
    <Modal hide-header-close class="modal-form" v-model="showModal">
        <form @submit.prevent="submit">
            <slot />
        </form>

        <template #title>
            <slot name="title">{{ t('modal.form.title') }}</slot>
        </template>

        <template #footer>
            <button class="btn btn-sm btn-ghost" @click="cancel">
                <slot name="cancel-btn-content">
                    {{ t('common.action.cancel') }}
                </slot>
            </button>

            <button class="btn btn-sm btn-secondary" @click="submit">
                <slot name="submit-btn-content">
                    {{ t('common.action.submit') }}
                </slot>
            </button>
        </template>
    </Modal>
</template>
