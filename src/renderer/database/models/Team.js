export default function (sequelize, DataTypes) {
    return sequelize.define('Team', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        competition_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            references: {
                model: 'Competition',
                key: 'id'
            },
            unique: true
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false
        }
    }, {
        tableName: 'Team'
    })
}
