<script setup lang="ts">
import { ref, useAttrs, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from './Modal.vue'

enum MODAL_TYPE {
    Info = 'info',
    Warning = 'warning',
    Danger = 'danger',
}

const // Initialization
    { t } = useI18n(),
    attrs = useAttrs(),
    emit = defineEmits(['confirm']),
    // Refs
    confirmCallback = ref<Function>(() => {}),
    showModal = ref<boolean>(false),
    // Computed
    modalType = computed(() => {
        const attrList: Array<string> = Object.keys(attrs)
        if (attrList.includes(MODAL_TYPE.Info)) return MODAL_TYPE.Info
        if (attrList.includes(MODAL_TYPE.Warning)) return MODAL_TYPE.Warning
        if (attrList.includes(MODAL_TYPE.Danger)) return MODAL_TYPE.Danger
        return MODAL_TYPE.Info
    }),
    icon = computed(() => {
        let iconName
        switch (modalType.value) {
            case MODAL_TYPE.Info:
                iconName = 'info-circle'
                break
            case MODAL_TYPE.Warning:
                iconName = 'exclamation-triangle'
                break
            case MODAL_TYPE.Danger:
                iconName = 'skull-crossbones'
                break
            default:
                break
        }
        return ['fas', `${iconName}`]
    }),
    // Methods
    onConfirm = (f: Function) => (confirmCallback.value = f), // Same purpose that emit('confirm') but programmatically
    show = () => (showModal.value = true),
    close = () => (showModal.value = false),
    confirm = () => {
        emit('confirm')
        confirmCallback.value()
        close()
    }

defineExpose({ show, close, onConfirm })
</script>

<template>
    <Modal
        hide-header-close
        class="modal-confirmation"
        :class="[modalType]"
        v-model="showModal"
    >
        <slot>&nbsp;</slot>

        <template #title>
            <FontAwesomeIcon :icon="icon" class="mr-2"></FontAwesomeIcon>
            <slot name="title">{{ t('modal.confirmation.title') }}</slot>
        </template>

        <template #footer>
            <button class="btn btn-sm btn-ghost" @click="close">
                {{ t('common.action.close') }}
            </button>
            <button class="btn btn-sm btn-secondary" @click="confirm">
                {{ t('common.action.confirm') }}
            </button>
        </template>
    </Modal>
</template>

<style scoped>
.info :deep(.modal-box) {
    @apply border-info;
    @apply bg-info;
}
.warning :deep(.modal-box) {
    @apply border-warning;
    @apply bg-warning;
}
.danger :deep(.modal-box) {
    @apply border-error;
    @apply bg-error;
}
.modal-confirmation :deep(.modal-box) {
    @apply border-2;
    @apply bg-opacity-30;
}
</style>
