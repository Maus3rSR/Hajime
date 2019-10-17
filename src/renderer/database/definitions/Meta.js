import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "Meta",
    getDefinition: with_timestamp => {
        return {
            metaable_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false
            },
            metaable: {
                type: Sequelize.STRING(45),
                allowNull: false
            },
            key: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            value: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            ...with_timestamp && timestamp_definition
        }
    },
    // getAssociation: Model => model_list => {}
}