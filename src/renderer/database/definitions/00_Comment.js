import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "Comment",
    getDefinition: with_timestamp => {
        return {
            id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            commentable_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
            },
            commentable: {
                type: Sequelize.STRING(45),
                allowNull: false,
            },
            text: {
                type: Sequelize.TEXT(),
                allowNull: false,
            },
            ...with_timestamp && timestamp_definition
        }
    },
    // getAssociation: Model => model_list => {}
}