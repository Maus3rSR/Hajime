import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "PoolEntry",
    constraint_list: [{
        field_list: ['pool_id', 'entriable_id', 'entriable'], key: { type: 'unique' } 
    }, {
        field_list: ['pool_id', 'number'], key: { type: 'unique' } 
    }],
    getDefinition: with_timestamp => {
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
            entriable_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false
            },
            entriable: {
                type: Sequelize.STRING(45),
                allowNull: false
            },
            ...with_timestamp && timestamp_definition
        }
    },
    getAssociation: Model => model_list => {
        ["Fighter", "Team"].forEach(entriable => // TODO Il faudrait pouvoir définir qu'une seule association `as: 'entry'` et qui va chercher dynamiquement soit sur Fighter, soit sur Team...
            Model.belongsTo(model_list[entriable], {
                foreignKey: 'entriable_id',
                constraints: false, // for polymorphic relationship
                as: entriable.toLowerCase()
            })
        )
    }
}