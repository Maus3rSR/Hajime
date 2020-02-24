import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "Fool",
    getDefinition: with_timestamp => {
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
            fighter_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                references: {
                    model: 'Fighter',
                    key: 'id'
                }
            },
            number: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: true,
                default: 0
            },
            ...with_timestamp && timestamp_definition
        }
    },
    // getAssociation: Model => model_list => {}
}