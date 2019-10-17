import Sequelize from 'sequelize'
// import timestamp_definition from './timestamp'

export default {
    name: "Formula",
    timestamps: false,
    getDefinition: (/* with_timestamp */) => {
        return {
            name: {
                type: Sequelize.STRING(45),
                allowNull: false
            },
            component_list: {
                type: Sequelize.JSON,
                allowNull: false
            },
            // ...with_timestamp && timestamp_definition
        }
    },
    // getAssociation: Model => model_list => {}
}