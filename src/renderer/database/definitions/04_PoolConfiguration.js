import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "PoolConfiguration",
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
                },
                unique: true
            },
            dismiss_favorite: {
                type: Sequelize.INTEGER(3).UNSIGNED,
                allowNull: true,
                defaultValue: '0'
            },
            lock: {
                type: Sequelize.INTEGER(3).UNSIGNED,
                allowNull: true,
                defaultValue: '0'
            },
            number_of_qualified_fighter: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: true,
                defaultValue: '1'
            },
            number_of_pool: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: true,
                defaultValue: '1'
            },
            number_of_entry_per_pool: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: true,
                defaultValue: '1'
            },
            ...with_timestamp && timestamp_definition
        }
    },
    // getAssociation: Model => model_list => {}
}