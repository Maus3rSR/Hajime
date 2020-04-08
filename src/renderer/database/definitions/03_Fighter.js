import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "Fighter",
    constraint_list: [{ field_list: ['license', 'name'], key: { type: 'unique' } }],
    getDefinition: is_migration => {
        return {
            id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            competition_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: true,
                references: {
                    model: 'Competition',
                    key: 'id'
                }
            },
            team_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: true,
                references: {
                    model: 'Team',
                    key: 'id'
                }
            },
            license: {
                type: Sequelize.STRING(16),
                allowNull: false,
                validate: {
                    len: {
                        args: [1,16],
                        msg: "Le numéro de licence doit être de 16 caractères maximum"
                    },
                    notNull: {
                        msg: "Le numéro de licence est obligatoire"
                    }
                }
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Le nom est obligatoire"
                    }
                }
            },
            grade: {
                type: Sequelize.STRING(15),
                allowNull: true
            },
            club: {
                type: Sequelize.STRING(255),
                allowNull: true
            },
            birthdate: {
                type: Sequelize.DATEONLY,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "La date de naissance est obligatoire"
                    }
                }
            },
            is_present: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
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
        Model.belongsTo(model_list.Team, { as: 'team', foreignKey: 'team_id' })
        Model.hasOne(model_list.Fool, { as: 'fool', foreignKey: 'fighter_id' })
        Model.hasMany(model_list.Score, { as: 'score_given_list', foreignKey: 'from_fighter_id' })
        Model.hasMany(model_list.Score, { as: 'score_received_list', foreignKey: 'on_fighter_id' })
        Model.hasMany(model_list.FightFighterOrder, { as: 'fight_order_list', foreignKey: 'fighter_id' })
    }
}