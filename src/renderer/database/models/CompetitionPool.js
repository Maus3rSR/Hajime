export default function (sequelize, Sequelize) {
    return sequelize.define('CompetitionPool', {
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
        number_of_qualified_fighter: {
            type: Sequelize.INTEGER(10).UNSIGNED,
            allowNull: false,
            defaultValue: '1'
        },
        number_of_pool: {
            type: Sequelize.INTEGER(10).UNSIGNED,
            allowNull: true,
            defaultValue: '0'
        },
        number_of_player_per_pool: {
            type: Sequelize.INTEGER(10).UNSIGNED,
            allowNull: true,
            defaultValue: '0'
        },
        dismiss_favorite: {
            type: Sequelize.INTEGER(3).UNSIGNED,
            allowNull: true,
            defaultValue: '0'
        },
        locked: {
            type: Sequelize.INTEGER(3).UNSIGNED,
            allowNull: true,
            defaultValue: '0'
        }
    }, {
        tableName: 'CompetitionPool'
    })
}
