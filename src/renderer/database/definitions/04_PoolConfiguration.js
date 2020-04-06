import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "PoolConfiguration",
    getDefinition: is_migration => {
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
            repulse_favorite: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            repulse_club: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            locked: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            number_of_qualified_fighter: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                defaultValue: 1
            },
            number_of_pool: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                defaultValue: 1
            },
            number_of_entry_per_pool: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                defaultValue: 1
            },
            ...is_migration && timestamp_definition
        }
    },
    // getAssociation: Model => model_list => {}
}