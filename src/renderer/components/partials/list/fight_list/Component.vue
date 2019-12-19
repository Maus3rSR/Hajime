<script>
export default {
    props: {
        list: {
            type: Array,
            required: true
        },
        index: {
            type: Number,
            default: null
        }
    },
    computed: {
        name() {
            const name = "fight_list"
            return this.index === null ? name : `${name}_${this.index}`
        }
    }
}
</script>

<template>
    <div>
        <data-list
            :name="name"
            title="Matchs"

            :list="[]"
            :total="0"
            :isDynamic="false"
        >

        </data-list>
    </div>
</template>