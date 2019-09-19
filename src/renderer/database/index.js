import Sequelize from 'sequelize'
import models from './models'

const TZ = "Etc/GMT-2"
const sequelize = new Sequelize('mariadb://askc:askc@127.0.0.1:3310/askc', { 
    timezone: TZ,
    dialectOptions: {
        timezone: TZ 
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

const repositories = {}
Object.keys(models).forEach(modelName => {
    repositories[modelName] = models[modelName](sequelize, Sequelize)
})

const mapModel = name => {
    if (undefined === repositories[name])
        throw new Error("Model " + name + " not found")
    
    return repositories[name]
}

const mapModels = name_list => {
    const model_list_found = {}
    name_list.forEach(name => model_list_found[name] = mapModel(name))
    return model_list_found
}

export { Sequelize, sequelize, mapModel, mapModels }