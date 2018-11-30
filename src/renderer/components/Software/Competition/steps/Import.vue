<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    computed: {},
    methods: {},
    data() {
        return {
            total: 0,
            list: [],
            loading: false,
        }
    }
}
</script>

<template>
    <div>
        <div class="row">
            <div class="col-sm-12">
                <a class="btn btn-dark btn--icon-text" href="javascript:void(0);" @click.prevent="$emit('onBack')">
                    <i class="zmdi zmdi-arrow-left"></i>
                    Revenir au formulaire
                </a>
            </div>

            <div class="col-sm-12">
                <data-list
                    
                    name="fighters"
                    title="Total de combattants"
                    :columns="[
                        { label: 'Combattant', field: 'name', filterOptions: { active: true, placeholder: '' } },
                        { label: 'Date de naissance', field: 'birthdate', fieldName: 'date', filterOptions: { active: true, placeholder: '' } },
                        { label: 'Grade', field: 'birthdate', fieldName: 'grade', filterOptions: { active: true, placeholder: '' } },
                        { label: '', field: 'action-cell' }
                    ]"
                    :list="list"
                    :total="total"
                    :loading="loading"

                    ref="FighterList"
                >
                    <template slot="action-cell" slot-scope="props">
                        
                        <button class="btn btn-sm btn-outline-danger">
                            <i class="zmdi zmdi-close"></i>
                        </button>

                    </template>
                </data-list>
            </div>
        </div>
    </div>
</template>
