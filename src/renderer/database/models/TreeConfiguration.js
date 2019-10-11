export default function (sequelize, DataTypes) {
    return sequelize.define('TreeConfiguration', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        competition_formula_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            references: {
                model: 'CompetitionFormula',
                key: 'id'
            },
            unique: true
        },
        dismiss_favorite: {
            type: DataTypes.INTEGER(3).UNSIGNED,
            allowNull: true,
            defaultValue: '0'
        },
        third_place: {
            type: DataTypes.INTEGER(3).UNSIGNED,
            allowNull: true,
            defaultValue: '0'
        },
        lock: {
            type: DataTypes.INTEGER(3).UNSIGNED,
            allowNull: true,
            defaultValue: '0'
        }
    }, {
        tableName: 'TreeConfiguration'
    })
}
