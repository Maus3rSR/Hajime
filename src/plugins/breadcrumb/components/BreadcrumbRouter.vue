<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { BreadcrumbItemList } from '../types'

export default defineComponent({
    name: 'BreadcrumbRouter', // vue-router compliant
    setup() {

        const { t } = useI18n(),
            route = useRoute(),
            list: BreadcrumbItemList = ref([]),
            updateBreadcrumbItems = (): void => {
                route.matched.forEach((route: Object) => {
                    const { path, meta } = route,
                        breadcrumbMeta = meta.breadcrumb

                    if (!breadcrumbMeta) return

                    list.value.push({
                        to: path.length === 0 ? '/' : path,
                        text: t(breadcrumbMeta),
                    })
                })
            }

        onMounted(updateBreadcrumbItems)
        watch(route, updateBreadcrumbItems)

        return { list }
    }
})
</script>

<template>
    <Breadcrumb :items="list" />
</template>
