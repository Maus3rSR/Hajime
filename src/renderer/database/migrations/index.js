/**
 * The file enables `@/database/migrations/index.js` to import all sequelize migrations
 * in a one-shot manner. There should not be any reason to edit this file.
 */
 const files = require.context('.', false, /\.js$/)
 const migrations = {}
 
 files.keys().forEach(key => {
   if (key === './index.js') return
   migrations[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
 })
 
 export default migrations
 