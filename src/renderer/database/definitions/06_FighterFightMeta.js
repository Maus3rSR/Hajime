import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "FighterFightMeta",
    constraint_list: [{ field_list: ['fight_id', 'fighter1_id', 'fighter2_id'], key: { type: 'unique' } }],
    getDefinition: is_migration => {
        return {
            id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            fight_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                references: {
                    model: 'Fight',
                    key: 'id'
                }
            },
            fighter1_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                references: {
                    model: 'Fighter',
                    key: 'id'
                }
            },
            fighter2_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                references: {
                    model: 'Fighter',
                    key: 'id'
                }
            },
            locked: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            ...is_migration && timestamp_definition
        }
    },
    // getAssociation: Model => model_list => {}
}