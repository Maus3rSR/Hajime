<script setup lang="ts">
import type { ChildComponent } from 'vue'
import { ref, reactive, computed } from 'vue'
import { Tabs as VTabs } from 'vue3-tabs-component'

const // Initialization
    emit = defineEmits(['changed']),
    // Refs
    tabs = ref<ChildComponent>(),
    selectedIndex = ref<number>(),
    options = reactive({ useUrlFragment: false }),
    // Computed
    tabActiveElement = computed(() =>
        tabs.value?.$el.querySelector(
            `.tabs .tabs-component-tab:nth-child(${
                (selectedIndex.value || 0) + 1
            }) .tab`
        )
    ),
    boxWidth = computed(() => tabActiveElement.value?.clientWidth || 0),
    boxHeight = computed(() => tabActiveElement.value?.clientHeight || 0),
    boxLeftPosition = computed(() => tabActiveElement.value?.offsetLeft || 0),
    boxWidthStyle = computed(() => `${boxWidth.value}px`),
    boxHeightStyle = computed(() => `${boxHeight.value}px`),
    boxLeftPositionStyle = computed(() => `${boxLeftPosition.value}px`),
    // Methods
    tabChanged = (selectedTab: Record<string, any>) => {
        selectedIndex.value = selectedTab.tab.index
        emit('changed', selectedTab)
    }
</script>

<template>
    <VTabs
        ref="tabs"
        nav-class="tabs tabs-boxed tabs-boxed-moving"
        nav-item-link-class="tab"
        nav-item-link-active-class="tab-active"
        cache-lifetime="0"
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
    height: v-bind(boxHeightStyle);
    width: v-bind(boxWidthStyle);
    left: v-bind(boxLeftPositionStyle);
    transition: left 0.5s cubic-bezier(0, 0.86, 0.5, 1.29), width 0.3s ease;
}
</style>