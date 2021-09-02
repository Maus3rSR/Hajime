<script setup lang="ts">
import type { Ref } from 'vue'
import { ref, watchEffect } from 'vue'

type Iso = string
type Props = Record<string, any>
type ReactiveString = Ref<string>

const // Props
    props = defineProps<{ iso: Iso }>(),
    // Methods
    getClass = (iso: Iso): string => `flag-icon-${iso}`,
    // Refs
    flagClass: ReactiveString = ref('')

watchEffect(() => flagClass.value = getClass(props.iso))
</script>

<template>
    <span class="flag-icon" :class="flagClass"></span>
</template>

<style>
@import 'flag-icon-css/css/flag-icon.min.css';
</style>