import { join } from 'path'
import Sequelize from 'sequelize'
import model_definition_list from './models'

const app = require('electron').remote.app
const TZ = "Etc/GMT-2"

const CreateSequelizeInstance = conf => {
    if (undefined === conf)
        throw new Error("[CreateSequelizeInstance] configuration is undefined")

    let options = {
        dialectOptions: { timezone: TZ }, // TODO : voir s'il faut pas laisser par défault la bdd faire comme il le fait par défaut... pour rendre l'application utilisable à différents endroits du globe
        timezone: TZ // TODO : Dynamique par rapport à la localisation du client ?
    }

    if (conf.type === 'local')
    {
        conf.connection = {
            dialect: 'sqlite',
            storage: join(app.getPath("userData"), "db.sqlite")
        }
        options = {}
    }

    const sequelize = new Sequelize({
        ...conf.connection,
        ...options,
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
        },
        logging: (process.env.NODE_ENV !== 'production' ? console.log : false)
    })

    const model_list = {}
    Object.keys(model_definition_list).forEach(modelName => {
        model_list[modelName] = model_definition_list[modelName](sequelize, Sequelize)
    })

    Object.keys(model_list).forEach(modelName => {
        if (undefined !== model_list[modelName].associate)
            model_list[modelName].associate(model_list)
    })

    return { sequelize, model_list }
}

export { Sequelize, CreateSequelizeInstance }