import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "CompetitionFormula",
    getDefinition: is_migration => {
        return {
            id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            competition_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                references: {
                    model: 'Competition',
                    key: 'id'
                }
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            ...is_migration && timestamp_definition
        }
    },
    getAssociation: Model => model_list => {
        Model.hasOne(model_list.PoolConfiguration, { as: 'pool_configuration', foreignKey: 'competition_formula_id' })
        Model.hasOne(model_list.TreeConfiguration, { as: 'tree_configuration', foreignKey: 'competition_formula_id' })
        Model.belongsTo(model_list.Competition, { as: "competition", foreignKey: "competition_id" })
    }
}