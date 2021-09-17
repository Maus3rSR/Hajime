<script setup lang="ts">
import type { ChildComponent } from 'vue'
import { ref, reactive, computed, onMounted } from 'vue'
import { Tabs as VTabs } from 'vue3-tabs-component'

const // Refs
    tabs = ref<ChildComponent>(),
    selectedIndex = ref<number>(),
    options = reactive({ useUrlFragment: false }),
    // Computed
    tabSpace = computed(() => {
        if (!boxedTabElement.value) return 0
        const padding: number = parseInt(
                window
                    .getComputedStyle(boxedTabElement.value)
                    .getPropertyValue('padding-left'),
                10
            ),
            width: number = boxedTabElement.value.clientWidth

        return (padding * 100) / width
    }),
    tabLength = computed(() => tabs.value?.tabs.length || 0),
    boxedTabElement = computed(() =>
        tabs.value?.$el.querySelector('.tabs-boxed-moving')
    ),
    boxWidth = computed(() => (100 - tabSpace.value * 2) / tabLength.value),
    boxLeftPosition = computed(
        () => boxWidth.value * selectedIndex.value + tabSpace.value
    ),
    boxWidthStyle = computed(() => `${boxWidth.value}%`),
    boxLeftPositionStyle = computed(() => `${boxLeftPosition.value}%`),
    // Methods
    tabChanged = (selectedTab: Record<string, any>) =>
        (selectedIndex.value = selectedTab.tab.index)

onMounted(() => {})
</script>

<template>
    <VTabs
        ref="tabs"
        nav-class="tabs tabs-boxed tabs-boxed-moving"
        nav-item-link-class="tab"
        nav-item-link-active-class="tab-active"
        :options="options"
        @changed="tabChanged"
    >
        <slot></slot>
    </VTabs>
</template>

<style scoped>
:deep(.tabs-boxed .tab-active) {
    background: none;
}
:deep(.tabs-boxed) {
    position: relative;
    z-index: 0;
}
:deep(.tabs-boxed::before) {
    @apply rounded-btn bg-primary;
    content: '';
    display: block;
    position: absolute;
    z-index: -1;
    height: 75%;
    width: v-bind(boxWidthStyle);
    left: v-bind(boxLeftPositionStyle);
    transition: left 0.5s cubic-bezier(0, 0.86, 0.5, 1.29);
}
</style>