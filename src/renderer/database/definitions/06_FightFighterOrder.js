import Sequelize from 'sequelize'
//import timestamp_definition from './timestamp'

export default {
    name: "FightFighterOrder",
    options: { timestamps: false },
    constraint_list: [{ field_list: ['fight_id', 'fighter_id', 'order'], key: { type: 'unique' } }],
    getDefinition: (/*is_migration*/) => {
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
            fighter_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                references: {
                    model: 'Fighter',
                    key: 'id'
                }
            },
            order: {
                type: Sequelize.INTEGER(2),
                allowNull: false,
                defaultValue: 0
            },
            // ...is_migration && timestamp_definition
        }
    },
    getAssociation: Model => model_list => {
        Model.belongsTo(model_list.Fighter, { as: 'fighter', foreignKey: 'fighter_id' })
    }
}