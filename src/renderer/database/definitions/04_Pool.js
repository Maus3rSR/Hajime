import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "Pool",
    constraint_list: [{ field_list: ['competition_formula_id', 'number'], key: { type: 'unique' } }],
    getDefinition: with_timestamp => {
        return {
            id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            competition_formula_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                references: {
                    model: 'CompetitionFormula',
                    key: 'id'
                }
            },
            number: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
            },
            marking_board_reversed: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: 0
            },
            ...with_timestamp && timestamp_definition
        }
    },
    getAssociation: Model => model_list => {
        Model.hasMany(model_list.PoolEntry, { as: 'entry_list', foreignKey: 'pool_id' })
        Model.hasMany(model_list.Fight, { as: 'fight_list', foreignKey: 'fightable_id', scope: { fightable: 'Pool' } })
    }
}