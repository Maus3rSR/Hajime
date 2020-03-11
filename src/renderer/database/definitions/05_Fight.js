import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "Fight",
    getDefinition: with_timestamp => {
        const add_virtual_field = with_timestamp === true ? undefined : true

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
            sudden_death: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            ...add_virtual_field && {
                is_locked: {
                    type: Sequelize.VIRTUAL,
                    get() { return null !== this.fighter_fight_meta && this.fighter_fight_meta.locked }
                },
                has_comment_list: {
                    type: Sequelize.VIRTUAL,
                    get() { return undefined !== this.comment_list && this.comment_list.length > 0 }
                }
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
        Model.hasOne(model_list.FighterFightMeta, { as: 'fighter_fight_meta', foreignKey: 'fight_id' })
        Model.hasMany(model_list.Comment, { as: 'comment_list', foreignKey: 'commentable_id', scope: { commentable: 'Fight' } })
    }
}