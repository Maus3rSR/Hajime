<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { BreadcrumbItem } from '../types'

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
    computed: {
        wrapperComponent(): string {
            if (!this.isLastItem && !!this.item.to) return 'router-link' // vue-router compliant
            if (!this.isLastItem && !!this.item.href) return 'a'
            return 'span'
        },
        componentProps(): Object | undefined {
            switch (this.wrapperComponent) {
                case 'router-link':
                    return { to: this.item.to }
                case 'a':
                    return { href: this.item.href }
            }
        },
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
