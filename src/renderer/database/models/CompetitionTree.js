export default function (sequelize, Sequelize) {
    return sequelize.define('CompetitionTree', {
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
        dismiss_favorite: {
            type: Sequelize.INTEGER(3).UNSIGNED,
            allowNull: true,
            defaultValue: '0'
        },
        third_place_match: {
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
        tableName: 'CompetitionTree'
    })
}
