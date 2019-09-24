export default function (sequelize, Sequelize) {
    return sequelize.define('CompetitionFormula', {
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
        }
    }, {
        tableName: 'CompetitionFormula'
    })
}
