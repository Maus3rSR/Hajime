import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "Competition",
    getDefinition: is_migration => {
        const add_virtual_field = is_migration === true ? undefined : true

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
            locked_entry_list: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            ...add_virtual_field && {
                entry_list: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        if (!!this.fighter_list && this.fighter_list.length > 0) return this.fighter_list.map(row => row.get({ plain: true }))
                        if (!!this.team_list && this.team_list.length > 0) return this.team_list.map(row => row.get({ plain: true }))
                        return []
                    }
                },
            },
            ...is_migration && timestamp_definition
        }
    },
    getAssociation: Model => model_list => {
        Model.hasMany(model_list.Fighter, { as: 'fighter_list', foreignKey: 'competition_id' })
        Model.hasMany(model_list.Team, { as: 'team_list', foreignKey: 'competition_id' })
        Model.hasMany(model_list.CompetitionFormula, { as: 'formula_config_list', foreignKey: 'competition_id' })
    }
}