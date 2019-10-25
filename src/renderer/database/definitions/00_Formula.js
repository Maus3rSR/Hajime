import Sequelize from 'sequelize'
// import timestamp_definition from './timestamp'

export default {
    name: "Formula",
    options: {
        timestamps: false,
        hooks: {
            afterFind: formula_list => (formula_list
                .map(formula => {
                    if (Array.isArray(formula.component_list))
                        return formula

                    formula.component_list = JSON.parse(formula.component_list)

                    return formula
                })
            )
        }
    },
    getDefinition: (/* with_timestamp */) => {
        return {
            id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
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