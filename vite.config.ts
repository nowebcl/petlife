import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'flow-api-dev-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && (req.url === '/api/flow' || req.url.startsWith('/api/flow'))) {
            try {
              const { default: handler } = await import('./api/flow.js');
              (res as any).status = (code: number) => {
                res.statusCode = code;
                return res;
              };
              (res as any).json = (data: any) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              };
              await handler(req, res);
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
            return;
          }
          next();
        });
      },
    },
  ],
});
