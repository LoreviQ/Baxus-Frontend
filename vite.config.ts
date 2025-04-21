import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            '/api': {
                target:
                    mode === 'production'
                        ? 'https://baxus-bob-1037939514360.europe-west1.run.app/'
                        : 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
    build: {
        sourcemap: true,
        minify: 'terser',
        terserOptions: {
            compress: {
                // Preserve console.logs for debugging
                pure_funcs: [],
                keep_fnames: true,
            },
            mangle: {
                keep_fnames: true,
            },
        },
    },
}));
