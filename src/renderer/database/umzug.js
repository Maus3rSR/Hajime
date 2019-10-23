import { join } from 'path'
import Umzug from 'umzug'
import Sequelize from 'sequelize'

const CreateUmzugInstance = sequelize => {
    const umzug = new Umzug({
        storage: 'sequelize',
        storageOptions: {
            sequelize: sequelize
        },
        migrations: {
            params: [
                sequelize.getQueryInterface(), // queryInterface
                Sequelize, // DataTypes
                () => { throw new Error('Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.') }
            ],
            path: join(__dirname, "migrations"),
            pattern: /\.js$/
        },
        logging: (process.env.NODE_ENV !== 'production' ? console.log : false),
    })

    const status = () => new Promise((resolve, reject) =>
        Promise.all([umzug.executed(), umzug.pending()])
            .then(res => resolve({ executed: res[0], pending: res[1] }))
            .catch(error => reject(error))
    )
    const logUmzugEvent = eventName => (name, migration) => console.log(`${ name } ${ eventName }`)

    umzug.on('migrating', logUmzugEvent('migrating'))
    umzug.on('migrated',  logUmzugEvent('migrated'))
    umzug.on('reverting', logUmzugEvent('reverting'))
    umzug.on('reverted',  logUmzugEvent('reverted'))

    return { umzug, status }
}

export { CreateUmzugInstance }