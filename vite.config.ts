import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/flow': {
        target: 'https://www.flow.cl',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/flow/, '/api'),
      },
    },
  },
});
