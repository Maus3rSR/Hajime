<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props { disabled: boolean }

const // Props
    props = defineProps<Props>(),
    // Refs
    tempo = ref<HTMLElement>(),
    // Computed
    button = computed(() => tempo.value?.querySelector<HTMLButtonElement>('button'))

watch(button, btn => { if (btn instanceof HTMLButtonElement) btn.disabled = props.disabled }, { immediate: true})
watch(() => props.disabled, value => {
    if (button.value instanceof HTMLButtonElement) button.value.disabled = value
})

</script>

<template>
    <span ref="tempo" :class="[ props.disabled ? '' : 'animate__animated animate__tada' ]">
        <slot></slot>
    </span>
</template>