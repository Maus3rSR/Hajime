export default function (sequelize, Sequelize) {
    return sequelize.define('Meta', {
        metaable_id: {
            type: Sequelize.INTEGER(10).UNSIGNED,
            allowNull: false
        },
        metaable: {
            type: Sequelize.STRING(45),
            allowNull: false
        },
        key: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        value: {
            type: Sequelize.STRING(255),
            allowNull: false
        }
    }, {
        tableName: 'Meta'
    })
}
