import Sequelize from 'sequelize'
import * as models from './models'

const sequelize = new Sequelize('mariadb://askc:askc@127.0.0.1:3310/askc', { 
    dialectOptions: {
        timezone: "Etc/GMT+2" 
    },
    define: {
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        charset: 'utf8',
        dialectOptions: {
            charset: 'utf8',
            collate: 'utf8_general_ci'
        },
        timestamps: true
    }
})

const database = {
    Sequelize,
    sequelize
}

Object.keys(models.default).forEach(modelName => {
    database[modelName] = models.default[modelName](sequelize, Sequelize)
})

export default database