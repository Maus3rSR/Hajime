/**
 * The file enables to import all locales messages in a one-shot manner.
 * There should not be any reason to edit this file.
 */
const files = require.context('.', false, /\.json$/)
const messages = {}

files.keys().forEach(key => {
  if (key === './messages.js') return
  messages[key.replace(/(\.\/|\.json)/g, '')] = files(key)
})

export default messages