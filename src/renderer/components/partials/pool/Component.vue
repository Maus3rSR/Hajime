<script>
export default {
    props: {
        id: {
            type: Number,
            required: true
        },
        list: {
            type: Array,
            required: true
        }
    }
}
</script>

<template>
    <div class="card pool">
        <div class="card-body">
            <h4 class="card-title">Poule N° {{ id }}</h4>

            <transition-group name="list" tag="ul">
                <li class="list-item" v-for="(entry, index) in list" :key="index">{{ id }}.{{ index+1 }} {{ entry.name }}</li>
            </transition-group>
        </div>
    </div>
</template>

<style lang="scss" scoped>
ul {
    list-style-type: none;
}
</style>
