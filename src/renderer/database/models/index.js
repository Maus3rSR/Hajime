/**
 * The file enables `@/database/index.js` to import all sequelize models
 * in a one-shot manner. There should not be any reason to edit this file.
 */
 const files = require.context('.', false, /\.js$/)
 const models = {}
 
 files.keys().forEach(key => {
   if (key === './index.js') return
   models[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
 })
 
 export default models
 