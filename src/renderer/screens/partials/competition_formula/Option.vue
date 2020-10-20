<script>
export default {
    props: {
        value: {
            type: Number,
            required: true
        },
        formula: {
            type: Object,
            required: true
        }
    },
    computed: {
        active() {
            return this.value === this.formula.id
        }
    },
    methods: {
        getSrc(code) {
            return require(`@images/competition_formula/${code}.png`)
        }
    }
}
</script>

<template>
    <div>
        <div class="card" :class="[active ? 'active' : '']" @click="$emit('input', formula.id)">
            <img :src="getSrc(formula.code)" width="50px" class="card-img-top" />
            <div class="card-body text-center">
                {{ formula.name }}
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.card {
    padding: 15px;
    transform: all ease 1000ms;

    &:hover {
        cursor: pointer;
        border: #eaeaea solid 1px;
    }

    &.active {
        border: #fff solid 2px;
    }

    img {
        width: 80px;
        margin: 0 auto;
    }
    .card-body {
        padding: 0;
    }
}
</style>