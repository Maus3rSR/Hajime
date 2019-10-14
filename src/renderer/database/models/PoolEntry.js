
export default function (sequelize, DataTypes) {
    return sequelize.define('PoolEntry', {
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
}
