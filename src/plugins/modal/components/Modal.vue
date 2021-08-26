<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), { modelValue: false }),
    emit = defineEmits(['update:modelValue']),
    modalClass = computed(() => ({ 'modal-open': props.modelValue })),
    close = () => emit('update:modelValue', false)
</script>

<template>
    <div class="modal" :class="modalClass">
        <div class="modal-box">
            <div class="text-xl mb-5 title">
                <slot name="title">Title</slot>
            </div>

            <slot>Modal body</slot>

            <div class="modal-action">
                <slot name="footer" :close="close">
                    <button class="btn" @click="close">
                        <slot name="close-btn-content">Close</slot>
                    </button>
                </slot>
            </div>
        </div>
    </div>
</template>
