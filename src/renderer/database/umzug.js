import Umzug from 'umzug'
import migration_list from './migrations'

const isDevelopment = process.env.NODE_ENV !== 'production'
const isDebugBuild = process.env.ELECTRON_WEBPACK_IS_DEBUG_BUILD

const CreateMigration = (queryInterface, key, { up, down }) => {
    return {
        path: null,
        file: key,
        up: () => up(queryInterface),
        down: () => down(queryInterface),
        testFileName: needle => key.startsWith(needle)
    }
}

const CreateUmzugInstance = sequelize => {
    const umzug = new Umzug({
        storage: 'sequelize',
        storageOptions: { sequelize: sequelize },
        logging: (isDevelopment || isDebugBuild ? console.log : false),
        migrations: Object.keys(migration_list).map(migration_name => CreateMigration(sequelize.getQueryInterface(), migration_name, migration_list[migration_name]))
    })

    const status = () => Promise.all([umzug.executed(), umzug.pending()]).then(res => ({ executed: res[0], pending: res[1] }))
    const logUmzugEvent = eventName => (name, migration) => console.log(`${ name } ${ eventName }`)

    umzug.on('migrating', logUmzugEvent('migrating'))
    umzug.on('migrated',  logUmzugEvent('migrated'))
    umzug.on('reverting', logUmzugEvent('reverting'))
    umzug.on('reverted',  logUmzugEvent('reverted'))

    return { umzug, status }
}

export { CreateUmzugInstance }