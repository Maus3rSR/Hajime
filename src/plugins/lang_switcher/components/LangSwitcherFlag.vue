<script lang="ts">
import type { Ref } from 'vue'
import { defineComponent, PropType, toRefs, ref, watch } from 'vue'

type Iso = string
type Props = Record<string, any>
type ReactiveString = Ref<string>

export default defineComponent({
    name: 'LangSwitcherFlag',
    props: {
        iso: {
            type: String as PropType<Iso>,
            required: true,
        },
    },
    setup(props: Props) {
        const { iso } = toRefs(props),
            getClass = (iso: Iso): string => `flag-icon-${iso}`,
            flagClass: ReactiveString = ref(getClass(iso.value))

        watch(iso, (iso: Iso) => (flagClass.value = getClass(iso)))

        return { flagClass }
    },
})
</script>

<template>
    <span class="flag-icon" :class="flagClass" />
</template>

<style>
@import 'flag-icon-css/css/flag-icon.min.css';
</style>