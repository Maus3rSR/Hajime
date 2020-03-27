import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "TreeConfiguration",
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
                type: Sequelize.INTEGER(3).UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },
            repulse_club: {
                type: Sequelize.INTEGER(3).UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },
            third_place: {
                type: Sequelize.INTEGER(3).UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },
            locked: {
                type: Sequelize.INTEGER(3).UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },
            ...is_migration && timestamp_definition
        }
    },
    // getAssociation: Model => model_list => {}
}