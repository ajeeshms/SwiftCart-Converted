// filename: vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: parseInt(process.env.VITE_PORT || '5001'),
        proxy: {
            // Updated proxy rules to match specified gateway prefixes and target port 6001
            '/productservice': {
                target: 'http://localhost:6001',
                changeOrigin: true,
                secure: false,
                // rewrite: (path) => path.replace(/^\/productservice/, '/api') // Gateway handles this rewrite
            },
            '/userservice': {
                target: 'http://localhost:6001',
                changeOrigin: true,
                secure: false,
            },
            '/cartservice': {
                target: 'http://localhost:6001',
                changeOrigin: true,
                secure: false,
            },
            '/orderservice': {
                target: 'http://localhost:6001',
                changeOrigin: true,
                secure: false,
            },
            '/notificationservice': {
                target: 'http://localhost:6001',
                changeOrigin: true,
                secure: false,
            },
            // Add more service routes as needed
        },
    },
});