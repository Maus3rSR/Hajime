<script setup lang="ts">
import { useAttrs, computed } from 'vue'

interface Props {
    modelValue?: boolean
}

const // Initialization
    props = withDefaults(defineProps<Props>(), { modelValue: false }),
    emit = defineEmits(['update:modelValue']),
    attrs = useAttrs(),
    // Computed
    modalClass = computed(() => ({ 'modal-open': props.modelValue })),
    hideHeaderClose = computed(() =>
        Object.keys(attrs).includes('hide-header-close')
    ),
    // Methods
    close = () => emit('update:modelValue', false)
</script>

<template>
    <div class="modal" :class="modalClass">
        <div class="modal-box indicator">
            <div class="indicator-item indicator-top">
                <button
                    class="btn btn-sm btn-circle"
                    @click="close"
                    v-if="!hideHeaderClose"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        class="
                            inline-block
                            w-4
                            h-4
                            stroke-current
                            md:w-6
                            md:h-6
                        "
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        ></path>
                    </svg>
                </button>
            </div>

            <div class="text-xl mb-5 title">
                <slot name="title">Title</slot>
            </div>

            <slot></slot>

            <div class="modal-action">
                <slot name="footer" :close="close">
                    <span class="flex-grow">
                        <slot name="footer-info"></slot>
                    </span>

                    <slot name="footer-action" :close="close">
                        <button class="btn btn-sm btn-ghost" @click="close">
                            <slot name="close-btn-content">Close</slot>
                        </button>
                    </slot>
                </slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
.indicator {
    display: block;
}
</style>