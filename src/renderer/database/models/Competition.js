export default function(sequelize, Sequelize) {
    return sequelize.define('Competition', {
        id: {
            type: Sequelize.INTEGER(10).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        choosen_formula_id: {
            type: Sequelize.INTEGER(10).UNSIGNED,
            allowNull: false,
            references: {
                model: 'Formula',
                key: 'id'
            }
        },
        date: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        place: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        owner: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        type: {
            type: Sequelize.STRING(10),
            allowNull: false
        },
        locked: {
            type: Sequelize.INTEGER(3).UNSIGNED,
            allowNull: true,
            defaultValue: '0'
        },
            locked_fighter_list: {
            type: Sequelize.INTEGER(3).UNSIGNED,
            allowNull: true,
            defaultValue: '0'
        }
    }, {
        tableName: 'Competition'
    })
}
