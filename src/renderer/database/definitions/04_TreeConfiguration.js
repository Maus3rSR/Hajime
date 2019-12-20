import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "TreeConfiguration",
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
            third_place: {
                type: Sequelize.INTEGER(3).UNSIGNED,
                allowNull: true,
                defaultValue: '0'
            },
            locked: {
                type: Sequelize.INTEGER(3).UNSIGNED,
                allowNull: true,
                defaultValue: '0'
            },
            ...with_timestamp && timestamp_definition
        }
    },
    // getAssociation: Model => model_list => {}
}