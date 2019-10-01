export default function (sequelize, Sequelize) {
    return sequelize.define('CompetitionFormula', {
        competition_id: {
            type: Sequelize.INTEGER(10).UNSIGNED,
            allowNull: false,
            references: {
                model: 'Competition',
                key: 'id'
            }
        },
        name: {
            type: Sequelize.STRING(50),
            allowNull: false
        }
    }, {
        tableName: 'CompetitionFormula'
    })
}
