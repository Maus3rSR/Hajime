<script>
export default {
    computed: {},
    methods: {
        updateList() {
            this.list = this.$route.meta.breadcrumb
        }
    },
    data () {
        return {
            list: []
        }
    },
    mounted () { this.updateList() },
    watch: { '$route' () { this.updateList() } },
}
</script>

<template>
    <div>HEY</div>
</template>