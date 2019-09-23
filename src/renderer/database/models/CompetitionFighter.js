export default function (sequelize, Sequelize) {
    return sequelize.define('CompetitionFighter', {
        id: {
            type: Sequelize.INTEGER(10).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        license: {
            type: Sequelize.STRING(16),
            allowNull: false,
            unique: true
        },
        competition_id: {
            type: Sequelize.INTEGER(10).UNSIGNED,
            allowNull: false,
            references: {
                model: 'Competition',
                key: 'id'
            }
        },
        birthdate: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        grade: {
            type: Sequelize.STRING(15),
            allowNull: true
        },
        club: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        team: {
            type: Sequelize.STRING(60),
            allowNull: true
        },
        is_present: {
            type: Sequelize.INTEGER(3).UNSIGNED,
            allowNull: true,
            defaultValue: '0'
        }
    }, {
        tableName: 'CompetitionFighter'
    })
}
