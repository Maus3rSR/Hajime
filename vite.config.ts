import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    root: 'src',
    envDir: '../env',
    plugins: [vue()],
})
