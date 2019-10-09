export default function(sequelize, DataTypes) {
    return sequelize.define('Pool', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        competition_formula: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            references: {
                model: 'CompetitionFormula',
                key: 'id'
            },
            unique: true
        }
    }, {
        tableName: 'Pool'
    })
}
