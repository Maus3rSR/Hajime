import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'
import { ENTRIABLE_MODEL_NAME_LIST } from '@root/constant'

export default {
    name: "PoolEntry",
    constraint_list: [{
        field_list: ['pool_id', 'entriable_id', 'entriable'], key: { type: 'unique' } 
    }, {
        field_list: ['pool_id', 'number'], key: { type: 'unique' } 
    }],
    getDefinition: is_migration => {
        const add_virtual_field = is_migration === true ? undefined : true

        return {
            id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            pool_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                references: {
                    model: 'Pool',
                    key: 'id'
                }
            },
            number: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
            },
            score: {
                type: Sequelize.INTEGER(10),
                allowNull: false,
                defaultValue: 0
            },
            victory_number: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },
            score_given_number: {
                type: Sequelize.INTEGER(10),
                allowNull: false,
                defaultValue: 0
            },
            score_received_number: {
                type: Sequelize.INTEGER(10),
                allowNull: false,
                defaultValue: 0
            },
            entriable_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false
            },
            entriable: {
                type: Sequelize.STRING(45),
                allowNull: false
            },
            ...add_virtual_field && {
                ranking_score: {
                    type: Sequelize.VIRTUAL,
                    get() { return this.score * 1000000 + this.victory_number * 10000 + this.score_given_number * 100 - this.score_received_number }
                },
                entry: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        if (!!this.team) return this.team.get({ plain: true })
                        if (!!this.fighter) return this.fighter.get({ plain: true })
                        return null
                    }
                }
            },
            ...is_migration && timestamp_definition
        }
    },
    getAssociation: Model => model_list => {
        // TODO : Trouver un moyen de filtrer sur Entriable ... car sinon on a un fighter / team qui sort pour un ID en confusion...
        // Les hooks ne fonctionne pas. Ne peut pas implémenter le hookAfterFind d'un belongsTo polymorphique : https://sequelize.org/master/manual/polymorphic-associations.html
        ENTRIABLE_MODEL_NAME_LIST.forEach(entriable => // TODO Il faudrait pouvoir définir qu'une seule association `as: 'entry'` et qui va chercher dynamiquement soit sur Fighter, soit sur Team...
            Model.belongsTo(model_list[entriable], {
                foreignKey: 'entriable_id',
                constraints: false, // for polymorphic relationship
                as: entriable.toLowerCase()
            })
        )
    }
}