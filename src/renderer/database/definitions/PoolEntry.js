import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "PoolEntry",
    options: {
        indexes: [{ fields: ['pool_id', 'entriable_id', 'entriable'], unique: true }]
    },
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
                unique: 'pool_entry_number_unique',
                references: {
                    model: 'Pool',
                    key: 'id'
                }
            },
            number: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                unique: 'pool_entry_number_unique'
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
        Model.belongsTo(model_list.Fighter, {
            foreignKey: 'entriable_id',
            constraints: false,
            as: 'fighter'
        })
        Model.belongsTo(model_list.Team, {
            foreignKey: 'entriable_id',
            constraints: false,
            as: 'team'
        })
    }
}