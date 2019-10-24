import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "Pool",
    options: {
        indexes: [{ fields: ['competition_formula_id', 'number'], unique: true }]
    },
    getDefinition: with_timestamp => {
        return {
            id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            competition_formula_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                references: {
                    model: 'CompetitionFormula',
                    key: 'id'
                }
            },
            number: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
            },
            ...with_timestamp && timestamp_definition
        }
    },
    getAssociation: Model => model_list => {
        Model.hasMany(model_list.PoolEntry, { as: 'entry_list', foreignKey: 'pool_id' })
    }
}