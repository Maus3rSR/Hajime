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
        total() {
            return this.list.length
        },
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

            :list="list"
            :total="total"
            :isDynamic="false"
            :columns="[
                { label: 'ID', field: 'id' },
                { label: 'Combattant', field: 'fighter1.name' },
                { label: 'Combattant', field: 'fighter2.name' }
            ]"
        >

        </data-list>
    </div>
</template>