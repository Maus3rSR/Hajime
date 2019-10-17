import Umzug from 'umzug'

const createUmzugInstance = (Sequelize, sequelize) => {
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
            path: './migrations',
            pattern: /\.js$/
        },
        logging: (process.env.NODE_ENV !== 'production' ? console.log : false),
    })

    const status = () => new Promise(resolve => Promise.all([umzug.executed(), umzug.pending()]).then(res => resolve({ executed: res[0], pending: res[1] })))
    const logUmzugEvent = eventName => (name, migration) => console.log(`${ name } ${ eventName }`)

    umzug.on('migrating', logUmzugEvent('migrating'));
    umzug.on('migrated',  logUmzugEvent('migrated'));
    umzug.on('reverting', logUmzugEvent('reverting'));
    umzug.on('reverted',  logUmzugEvent('reverted'));

    return { umzug, status }
}

export { createUmzugInstance }