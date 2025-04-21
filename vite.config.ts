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
                        ? 'YOUR_PRODUCTION_BACKEND_URL' // TODO: Replace with your actual production backend URL
                        : 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
}));
