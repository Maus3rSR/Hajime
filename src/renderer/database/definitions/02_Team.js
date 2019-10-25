import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "Team",
    getDefinition: with_timestamp => {
        return {
            id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                primaryKey: true
            },
            competition_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                references: {
                    model: 'Competition',
                    key: 'id'
                },
                unique: true
            },
            name: {
                type: Sequelize.STRING(150),
                allowNull: false
            },
            ...with_timestamp && timestamp_definition
        }
    },
    getAssociation: Model => model_list => {
        Model.hasMany(model_list.Fighter, { as: 'fighter_list', foreignKey: 'team_id' })
    }
}