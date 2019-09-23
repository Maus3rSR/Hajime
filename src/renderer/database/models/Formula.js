export default function (sequelize, Sequelize) {
    return sequelize.define('Formula', {
        id: {
            type: Sequelize.INTEGER(10).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(45),
            allowNull: false
        },
        component_list: {
            type: Sequelize.STRING(255),
            allowNull: false
        }
    }, {
        tableName: 'Formula',
        timestamps: false,
        hooks: {
            afterFind: list => { list.forEach(formula => formula.component_list = JSON.parse(formula.component_list)) }
        }
    })
}
