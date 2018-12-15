<script>
import ModalFighter from './modal/Fighter'

export default {
    components: { ModalFighter },
    computed: {
        total() {
            return this.list.length
        }
    },
    methods: {
        openFighterModal() {
            this.$refs.modalFighter.show()
        },
        onFighterAdd(fighter) {
            this.list.push(fighter)
            this.$notify.success("Le combattant a bien été ajouté")
        },
        deleteFighter(row) {
            const index = this.list.findIndex(el => el.name+el.birthdate == row.name+row.birthdate)

            if (index < 0) {
                this.$notify.error("Le combattant à supprimer n'a pas été trouvé dans la liste")
                return
            }
            
            this.list.splice(index, 1)
            this.$notify.success("Le combattant a bien été supprimé")
        }
    },
    data() {
        return {
            list: []
        }
    }
}
</script>

<template>
    <div>
        <data-list
            
            name="fighters"
            title="Total de combattants"
            :columns="[
                { label: 'Combattant', field: 'name' },
                { label: 'Date de naissance', field: 'birthdate' },
                { label: 'Grade', field: 'grade' },
                { label: 'Club', field: 'club' },
                { label: '', field: 'action-cell' }
            ]"
            :list="list"
            :total="total"
            :isDynamic="false"

            ref="FighterList"
        >
            <template slot="action-bar">

                <a
                    href="javascript:void(0)"
                    class="actions__item zmdi zmdi-plus"
                    title="Ajouter un combattant"

                    @click.prevent="openFighterModal"   
                >
                </a>

            </template>

            <template slot="action-cell" slot-scope="props">
                
                <button title="Supprimer ce combattant de la liste" class="btn btn-sm btn-outline-danger" @click.prevent="deleteFighter(props.row)">
                    <i class="zmdi zmdi-close"></i>
                </button>

            </template>
        </data-list>

        <modal-fighter
            id="fighter"
            ref="modalFighter"

            @on-fighter-add="onFighterAdd"
        />

    </div>    
</template>

<style lang="scss" scoped>

</style>
