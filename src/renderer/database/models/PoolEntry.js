
export default function (sequelize, DataTypes) {
    const Model = sequelize.define('PoolEntry', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        pool_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            references: {
                model: 'Pool',
                key: 'id'
            },
            unique: true
        },
        number: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false
        },
        entriable_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false
        },
        entriable: {
            type: DataTypes.STRING(45),
            allowNull: false
        }
    }, {
        tableName: 'PoolEntry',
        getItem(options) {
            return this['get' + this.get('entriable')](options)
        }
    })

    Model.associate = models => {
        Model.belongsTo(models.Fighter, {
            foreignKey: 'entriable_id',
            constraints: false,
            as: 'fighter'
        })
        Model.belongsTo(models.Team, {
            foreignKey: 'entriable_id',
            constraints: false,
            as: 'team'
        })
    }

    return Model
}
