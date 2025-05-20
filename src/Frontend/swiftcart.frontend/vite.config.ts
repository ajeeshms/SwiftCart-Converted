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
      '/service': {
        target: 'http://localhost:6001',
        changeOrigin: true,
        secure: false
      }
      // add more service routes as needed
    },
  },
});