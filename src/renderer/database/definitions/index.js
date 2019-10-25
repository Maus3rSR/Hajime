/**
 * The file enables `@/database/definitions/index.js` to import all sequelize definitions
 * in a one-shot manner. There should not be any reason to edit this file.
 */
 const files = require.context('.', false, /\.js$/)
 const definitions = {}
 
 files.keys().forEach(key => {
   if (key === './index.js' || key === './timestamp.js') return
   definitions[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
 })
 
 export default definitions
 