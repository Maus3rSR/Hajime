export default function (sequelize, Sequelize) {
    return sequelize.define('Formula', {
        name: {
            type: Sequelize.STRING(45),
            allowNull: false
        },
        component_list: {
            type: Sequelize.JSON,
            allowNull: false
        }
    }, {
        tableName: 'Formula',
        timestamps: false
    })
}
