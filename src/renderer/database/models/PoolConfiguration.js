export default function (sequelize, DataTypes) {
    return sequelize.define('PoolConfiguration', {
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
        lock: {
            type: DataTypes.INTEGER(3).UNSIGNED,
            allowNull: true,
            defaultValue: '0'
        },
        number_of_qualified_fighter: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: true,
            defaultValue: '1'
        },
        number_of_pool: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: true,
            defaultValue: '1'
        },
        number_of_entry_per_pool: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: true,
            defaultValue: '1'
        }
    }, {
        tableName: 'Pool'
    })
}
