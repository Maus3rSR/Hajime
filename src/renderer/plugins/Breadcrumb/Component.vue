<script>
export default {
    computed: {},
    methods: {
        updateList() {
            this.list = []

            this.$route.matched.forEach(route => {
                if (undefined === route.meta.breadcrumb) return

                this.list.push({
                    to: route.path.length === 0 ? "/" : route.path,
                    text: this.$t(route.meta.breadcrumb),
                })
            })

            this.list[this.list.length-1].active = true
        }
    },
    data () {
        return {
            list: []
        }
    },
    mounted () { this.updateList() },
    watch: { '$route' () {this.updateList() } },
}
</script>

<template>
    <b-breadcrumb :items="list"></b-breadcrumb>
</template>