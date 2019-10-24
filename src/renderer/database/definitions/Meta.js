import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "Meta",
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
                unique: 'meta_unique'
            },
            metaable: {
                type: Sequelize.STRING(45),
                allowNull: false,
                unique: 'meta_unique'
            },
            key: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: 'meta_unique'
            },
            value: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: 'meta_unique'
            },
            ...with_timestamp && timestamp_definition
        }
    },
    // getAssociation: Model => model_list => {}
}