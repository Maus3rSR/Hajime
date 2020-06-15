import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "Tree",
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
                }
            },
            parent_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: true,
                references: {
                    model: 'Tree',
                    key: 'id'
                }
            },
            left_boundary: {
                type: Sequelize.BIGINT().UNSIGNED,
                allowNull: false,
            },
            right_boundary: {
                type: Sequelize.BIGINT().UNSIGNED,
                allowNull: false,
            },
            round_number: {
                type: Sequelize.INTEGER(2).UNSIGNED,
                allowNull: false,
            },
            label: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            ...is_migration && timestamp_definition
        }
    },
    getAssociation: Model => model_list => {
        Model.hasOne(model_list.Tree, { as: 'parent', foreignKey: 'parent_id' })
        Model.hasOne(model_list.Fight, { as: 'fight_list', foreignKey: 'fightable_id', scope: { fightable: 'Tree' } })
    }
}