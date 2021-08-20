<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { BreadcrumbItemList } from '../types'

export default defineComponent({
    name: 'BreadcrumbRouter', // vue-router compliant
    setup() {
        const route = useRoute(),
            list: BreadcrumbItemList = ref([]),
            updateBreadcrumbItems = (): void => {
                route.matched.forEach((route: Object) => {
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

        return { list }
    },
})
</script>

<template>
    <Breadcrumb :items="list" />
</template>
