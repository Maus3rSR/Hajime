import Sequelize from 'sequelize'
import model_definition_list from './models'

const TZ = "Etc/GMT-2"

const CreateSequelizeInstance = conf => {
    if (undefined === conf)
        throw new Error("[CreateSequelizeInstance] configuration is undefined")

    const sequelize = new Sequelize({
        ...conf.connection,
        timezone: TZ, // TODO : Dynamique par rapport à la localisation du client ?
        dialectOptions: {
            timezone: TZ // TODO : voir s'il faut pas laisser par défault la bdd faire comme il le fait par défaut... pour rendre l'application utilisable à différents endroits du globe
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