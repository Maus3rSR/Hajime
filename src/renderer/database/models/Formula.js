/**
 * DO NOT ERASE THIS FILE AUTOMATICALLY WITH https://github.com/sequelize/sequelize-auto 
 * If you need to update this file, do it manually according to the Sequelize documentation about model definition
 * @param {*} sequelize 
 * @param {*} DataTypes 
 */
export default function(sequelize, DataTypes) {
    return sequelize.define('Formula', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        component_list: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
    {
        tableName: 'Formula',
        timestamps: false,
        hooks: {
            afterFind: list => { list.forEach(formula => formula.component_list = JSON.parse(formula.component_list)) }
        } 
    })
}
