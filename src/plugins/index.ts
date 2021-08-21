import type { App } from 'vue'

const pluginModules = import.meta.glob('./**/index.ts'),
    plugins: Array<Object> = []

/**
 * Autoload plugins
 * @todo export to an utility file
 */
await (async () => {
    for (const path in pluginModules) {
        const plugin = await pluginModules[path]()
        plugins.push(plugin.default)
    }
})()

const install = (app: App): App => {
    plugins.forEach((plugin: Object) => app.use(plugin))
    return app
}

export default { install }
