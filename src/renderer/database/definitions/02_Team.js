import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "Team",
    getDefinition: is_migration => {
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
            is_favorite: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            ...is_migration && timestamp_definition
        }
    },
    getAssociation: Model => model_list => {
        Model.hasMany(model_list.Fighter, { as: 'fighter_list', foreignKey: 'team_id' })
    }
}