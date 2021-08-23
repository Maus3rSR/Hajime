<script lang="ts">
import { defineComponent, PropType, toRefs, computed } from 'vue'
import { BreadcrumbItem } from '../types'

type Props = Record<string, any>

export default defineComponent({
    name: 'BreadcrumbItem',
    props: {
        item: {
            type: Object as PropType<BreadcrumbItem>,
            required: true,
        },
        isLastItem: {
            type: Boolean,
            required: true,
        },
    },
    setup(props: Props) {
        const { item, isLastItem } = toRefs(props)

        const wrapperComponent = computed((): string => {
            if (!isLastItem && !!item.to) return 'router-link' // vue-router compliant
            if (!isLastItem && !!item.href) return 'a'
            return 'span'
        })

        const componentProps = computed((): Object | undefined => {
            switch (wrapperComponent) {
                case 'router-link':
                    return { to: item.to }
                case 'a':
                    return { href: item.href }
            }
        })

        return { wrapperComponent, componentProps }
    },
})
</script>

<template>
    <component :is="wrapperComponent" v-bind="componentProps">
        <slot :item="item">
            {{ item.text }}
        </slot>
    </component>
</template>
