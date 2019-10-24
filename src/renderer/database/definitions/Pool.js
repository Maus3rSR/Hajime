import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "Pool",
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
                unique: 'pool_number_unique',
                references: {
                    model: 'CompetitionFormula',
                    key: 'id'
                }
            },
            number: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                unique: 'pool_number_unique'
            },
            ...with_timestamp && timestamp_definition
        }
    },
    getAssociation: Model => model_list => {
        Model.hasMany(model_list.PoolEntry, { as: 'entry_list', foreignKey: 'pool_id' })
    }
}