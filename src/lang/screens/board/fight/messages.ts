/**
 * The file enables to import all locales messages in a one-shot manner.
 * There should not be any reason to edit this file.
 */
const files = import.meta.glob('./*.json'),
    messages: { [key: string]: string } = {}

await (async () => {
    for (const path in files) {
        const localeMessages = await files[path]()
        messages[path.replace(/(\.\/|\.json)/g, '')] = localeMessages
    }
})()

export default messages
