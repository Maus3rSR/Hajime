export default function (sequelize, Sequelize) {
    return sequelize.define('CompetitionFighter', {
        competition_id: {
            type: Sequelize.INTEGER(10).UNSIGNED,
            allowNull: false,
            references: {
                model: 'Competition',
                key: 'id'
            }
        },
        license: {
            type: Sequelize.STRING(16),
            allowNull: false,
            unique: true
        },
        name: {
            type: Sequelize.STRING(255),
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
        birthdate: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        is_present: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: '0'
        }
    }, {
        tableName: 'CompetitionFighter'
    })
}
