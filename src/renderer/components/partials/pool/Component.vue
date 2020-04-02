<script>
export default {
    props: {
        pool: {
            type: Object,
            required: true
        },
        blured: {
            type: Boolean,
            default: false
        },
        canShowDetail: {
            type: Boolean,
            required: true
        }
    }
}
</script>

<template>
    <div class="card pool">
        <div class="card-body">
            <h4 class="card-title">Poule N° {{ pool.number }}</h4>
            <div v-if="canShowDetail" class="actions">
                <a href="javascript:void(0);" class="actions__item zmdi zmdi-view-list-alt" title="Voir le détail du classement" @click.prevent="$emit('on-show-detail')"></a>
            </div>

            <transition-group name="list" tag="ul">
                <li class="list-item row" v-for="pool_entry in pool.entry_list" :key="pool_entry.entriable_id+'_'+pool_entry.number">
                    <span class="pool-id col-sm-2" v-if="!blured">
                        {{ pool.number }}.{{ pool_entry.number }}
                    </span>

                    <span class="pool-entry_name col-sm-8" :class="{ 'pool-entry_name__blured': blured }">
                        {{ pool_entry.entry.name }}
                        <i v-if="pool_entry.entry.is_favorite" class="zmdi zmdi-star text-yellow"></i>
                    </span>

                    <span class="col text-right" v-if="canShowDetail">
                        <span class="badge badge-pill" :class="{ 'badge-first-place': pool_entry.rank_number === 1, 'badge-second-place': pool_entry.rank_number === 2, 'badge-third-place': pool_entry.rank_number === 3 }">
                            #{{ pool_entry.rank_number }}
                        </span>
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
