import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "Team",
    constraint_list: [{ field_list: ['competition_id', 'name'], key: { type: 'unique' } }],
    getDefinition: is_migration => {
        const add_virtual_field = is_migration === true ? undefined : true

        return {
            id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            competition_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                references: {
                    model: 'Competition',
                    key: 'id'
                }
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
            ...add_virtual_field && {
                club: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        if (!this.fighter_list || this.fighter_list.length === 0)
                            return null

                        const club = this.fighter_list[0].club

                        if (!club) return null

                        for (let i = 1; i < this.fighter_list.length; i++)
                            if (this.fighter_list[i].club !== club) return null

                        return club
                    }
                },
            },
            ...is_migration && timestamp_definition
        }
    },
    getAssociation: Model => model_list => {
        Model.hasMany(model_list.Fighter, { as: 'fighter_list', foreignKey: 'team_id' })
    }
}