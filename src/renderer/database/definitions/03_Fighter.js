import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "Fighter",
    constraint_list: [{ field_list: ['competition_id', 'license'], key: { type: 'unique' } }],
    getDefinition: with_timestamp => {
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
                allowNull: true,
                defaultValue: '0'
            },
            is_favorite: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: '0'
            },
            ...with_timestamp && timestamp_definition
        }
    },
    // getAssociation: Model => model_list => {}
}