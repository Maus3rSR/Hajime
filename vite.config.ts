import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    root: 'src',
    envDir: '../env',
    plugins: [vue(), tsconfigPaths({ projects: ['../tsconfig.json'] })],
    define: {
        '__APP_VERSION__': JSON.stringify(process.env.npm_package_version)
    }
})
