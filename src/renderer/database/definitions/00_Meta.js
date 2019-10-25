import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "Meta",
    constraint_list: [{ field_list: ['metaable_id', 'metaable', 'key', 'value'], key: { type: 'unique' } }],
    getDefinition: with_timestamp => {
        return {
            id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            metaable_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
            },
            metaable: {
                type: Sequelize.STRING(45),
                allowNull: false,
            },
            key: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            value: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            ...with_timestamp && timestamp_definition
        }
    },
    // getAssociation: Model => model_list => {}
}