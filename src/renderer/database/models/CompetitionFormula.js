export default function (sequelize, Sequelize) {
    const Model = sequelize.define('CompetitionFormula', {
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

    Model.associate = models => {
        Model.hasOne(models.PoolConfiguration, { as: 'pool_configuration', foreignKey: 'competition_formula_id' })
        Model.hasOne(models.TreeConfiguration, { as: 'tree_configuration', foreignKey: 'competition_formula_id' })
    }

    return Model
}
