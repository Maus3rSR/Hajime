<script>
export default {
    props: {
        list: {
            type: Array,
            required: true
        },
        key: {
            type: Number,
            default: null
        }
    },
    computed: {
        name() {
            const name = "fight_list"
            return this.key === null ? name : `${name}_${this.key}`
        }
    }
}
</script>

<template>
    <div>
        <datalist
            :name="name"
            title="Matchs"

            :list="[]"
            :total="0"
            :isDynamic="false"
        >

        </datalist>
    </div>
</template>