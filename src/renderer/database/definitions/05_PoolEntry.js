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