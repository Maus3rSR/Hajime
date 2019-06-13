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
        },
        blured: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<template>
    <div class="card pool">
        <div class="card-body">
            <h4 class="card-title">Poule N° {{ id }}</h4>

            <transition-group name="list" tag="ul">
                <li class="list-item" v-for="(entry, index) in list" :key="index+'_'+entry.name">
                    <span class="pool-id">
                        {{ id }}.{{ index+1 }}
                    </span>
                    <span class="pool-entry_name" :class="{ 'pool-entry_name__blured': blured }">
                        {{ entry.name }}
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
