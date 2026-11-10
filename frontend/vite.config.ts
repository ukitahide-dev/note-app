// import { defineConfig } from 'vite'

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],

    // Docker内でファイル変更を検知する
    server: {
        watch: {
            usePolling: true,
        },
    },

    // --- 追記 ----
    test: {
        environment: 'jsdom',
        setupFiles: "./src/test/setup.ts",  //
    },


})
