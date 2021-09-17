<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { BreadcrumbItemList } from '../types'

export default defineComponent({
    name: 'Breadcrumb',
    props: {
        items: {
            type: Array as PropType<BreadcrumbItemList>,
            required: true,
        },
    },
    methods: {
        isLastItem(index: Number): boolean {
            return index === this.items.length - 1
        },
    },
})
</script>

<template>
    <div class="text-sm breadcrumbs">
        <ul>
            <li
                v-for="(item, index) in items"
                :key="`breadcrumb-item-${index}`"
            >
                <BreadcrumbItem
                    :item="item"
                    :is-last-item="isLastItem(index)"
                    #default="{ item }"
                >
                    <slot name="item" :item="item">{{ item.text }}</slot>
                </BreadcrumbItem>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.breadcrumbs li {
    @apply font-bold;
}

.breadcrumbs li > :deep(a) {
    @apply font-normal;
}
</style>