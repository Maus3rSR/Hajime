<script setup lang="ts">
import { useAttrs, computed } from 'vue'

const // Initialization
    attrs = useAttrs(),
    emit = defineEmits(['click']),
    // Computed
    tabClass = computed(() => ({ 'tab-active': Object.keys(attrs).includes('active') }))
</script>

<template>
    <a @click="event => emit('click', event)" class="tab" :class="tabClass">
        <slot></slot>
    </a>
</template>