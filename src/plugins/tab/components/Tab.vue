<script setup lang="ts">
import { Tab as VTab } from 'vue3-tabs-component'

interface Props {
    title: string
}

const // Initialization
    props = defineProps<Props>()
</script>

<template>
    <VTab :name="title">
        <slot></slot>
    </VTab>
</template>