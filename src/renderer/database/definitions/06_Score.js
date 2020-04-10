import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "Score",
    getDefinition: is_migration => {
        return {
            id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            fight_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                references: {
                    model: 'Fight',
                    key: 'id'
                }
            },
            from_fighter_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                references: {
                    model: 'Fighter',
                    key: 'id'
                }
            },
            on_fighter_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: true,
                references: {
                    model: 'Fighter',
                    key: 'id'
                }
            },
            score_type_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                references: {
                    model: 'ScoreType',
                    key: 'id'
                }
            },
            ...is_migration && timestamp_definition
        }
    },
    getAssociation: Model => model_list => {
        Model.belongsTo(model_list.ScoreType, { foreignKey: "score_type_id", as: "score_type" })
    }
}