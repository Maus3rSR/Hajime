<script>
export default {
    props: {
        pool: {
            type: Object,
            required: true
        },
        entry_field: {
            type: String,
            required: true
        },
        blured: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        pool_entry_list() {
            return this.pool.entry_list.filter(entry => undefined !== entry[this.entry_field])
        }
    }
}
</script>

<template>
    <div class="card pool">
        <div class="card-body">
            <h4 class="card-title">Poule N° {{ pool.number }}</h4>

            <transition-group name="list" tag="ul">
                <li class="list-item" v-for="pool_entry in pool_entry_list" :key="pool_entry.id+'_'+pool_entry.number">
                    <span class="pool-id">
                        {{ pool.number }}.{{ pool_entry.number }}
                    </span>
                    <span class="pool-entry_name" :class="{ 'pool-entry_name__blured': blured }">
                        {{ pool_entry[entry_field].name }}
                    </span>
                </li>
            </transition-group>
        </div>
    </div>
</template>

<style lang="scss" scoped>
ul {
    list-style-type: none;
}
.pool-entry_name
{
    &.pool-entry_name__blured {
        filter: blur(4px);
    }
}
</style>
