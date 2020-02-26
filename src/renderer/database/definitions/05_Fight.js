import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "Fight",
    getDefinition: with_timestamp => {
        return {
            id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            fightable_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false
            },
            fightable: {
                type: Sequelize.STRING(45),
                allowNull: false
            },
            entriable1_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false
            },
            entriable2_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false
            },
            entriable: {
                type: Sequelize.STRING(45),
                allowNull: false
            },
            ...with_timestamp && timestamp_definition
        }
    },
    getAssociation: Model => model_list => {
        ["Fighter", "Team"].forEach(entriable => // TODO Il faudrait pouvoir définir qu'une seule association `as: 'entry'` et qui va chercher dynamiquement soit sur Fighter, soit sur Team...
            [1, 2].forEach(number =>
                Model.belongsTo(model_list[entriable], {
                    foreignKey: `entriable${number}_id`,
                    constraints: false, // for polymorphic relationship
                    as: `${entriable.toLowerCase()}${number}`
                })
            )
        )

        Model.belongsTo(model_list.Pool, { foreignKey: "fightable_id", as: "pool" })
    }
}