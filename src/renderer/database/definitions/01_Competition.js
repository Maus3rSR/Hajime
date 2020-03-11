import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "Competition",
    getDefinition: with_timestamp => {
        return {
            id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            choosen_formula_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                references: {
                    model: 'Formula',
                    key: 'id'
                }
            },
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            place: {
                type: Sequelize.STRING(255),
                allowNull: true
            },
            owner: {
                type: Sequelize.STRING(45),
                allowNull: true
            },
            type: {
                type: Sequelize.STRING(10),
                allowNull: false
            },
            locked: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            locked_fighter_list: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            ...with_timestamp && timestamp_definition
        }
    },
    getAssociation: Model => model_list => {
        Model.hasMany(model_list.Fighter, { as: 'fighter_list', foreignKey: 'competition_id' })
        Model.hasMany(model_list.CompetitionFormula, { as: 'formula_config_list', foreignKey: 'competition_id' })
    }
}