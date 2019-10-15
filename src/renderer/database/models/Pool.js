export default function (sequelize, DataTypes) {
    const Model = sequelize.define('Pool', {
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
            }
        },
        number: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false
        }
    }, {
        tableName: 'Pool'
    })

    Model.associate = models => {
        Model.hasMany(models.PoolEntry, { as: 'entry_list', foreignKey: 'pool_id' })
    }

    return Model
}
