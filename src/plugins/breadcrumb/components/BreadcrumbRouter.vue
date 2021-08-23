<script lang="ts">
import type { Ref } from 'vue'
import { defineComponent, ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { BreadcrumbItemList } from '../types'

type ReactiveBreadcrumbItemList = Ref<Array<BreadcrumbItemList>>

export default defineComponent({
    name: 'BreadcrumbRouter', // vue-router compliant
    setup() {
        const { t } = useI18n(),
            route = useRoute(),
            list: ReactiveBreadcrumbItemList = ref([]),
            updateBreadcrumbItems = (): void => {
                list.value = []
                route.matched.forEach((route: any) => {
                    const { path, meta } = route,
                        breadcrumbMeta = meta.breadcrumb

                    if (!breadcrumbMeta) return

                    list.value.push({
                        to: path.length === 0 ? '/' : path,
                        text: breadcrumbMeta,
                    })
                })
            }

        onMounted(updateBreadcrumbItems)
        watch(route, updateBreadcrumbItems)

        return { t, list }
    },
})
</script>

<template>
    <Breadcrumb :items="list">
        <template #item="{ item }">{{ t(item.text) }}</template>
    </Breadcrumb>
</template>
