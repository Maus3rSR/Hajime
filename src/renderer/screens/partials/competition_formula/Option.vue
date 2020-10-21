<script>
const isDevEnv = process.env.NODE_ENV !== 'production'

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
        },
        isInDevelopment() { // TODO remove when all competition formula is implemented
            return !isDevEnv && this.formula.code !== 'pool'
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
        <div class="card" :class="[active ? 'active' : '', isInDevelopment ? 'development' : '']" @click="isInDevelopment ? '' : $emit('input', formula.id)">
            <img :src="getSrc(formula.code)" width="50px" class="card-img-top" />
            <div class="card-body text-center">
                {{ formula.name }}

                <div v-if="isInDevelopment" class="badge badge-warning">
                    {{ $t("common.alert.in-development") }}
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.card {
    padding: 15px;
    transform: all ease 1000ms;
    border: #fff solid 0px;

    &:hover {
        cursor: pointer;
        border: #eaeaea solid 1px;
    }

    &.active {
        border-width: 2px;
    }

    &.development {
        position: relative;

        &:after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
        }

        &:hover {
            cursor: not-allowed;
            border: none;
        }

        .badge {
            position: absolute;
            z-index: 2;
            top: 10px;
            right: 10px;
            font-size: 1rem;
        }
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