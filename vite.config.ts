import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import vue from '@vitejs/plugin-vue'
import html from 'vite-plugin-html'

export default defineConfig({
    root: 'src',
    envDir: '../env',
    plugins: [
        vue(),
        tsconfigPaths({ projects: ['../tsconfig.json'] }),
        html({ minify: true })
    ],
    define: {
        '__APP_VERSION__': JSON.stringify(process.env.npm_package_version)
    }
})
