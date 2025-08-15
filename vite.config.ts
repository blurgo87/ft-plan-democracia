import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api/consulta': {
        target: 'http://172.16.20.31:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/consulta/, '/api/consulta'),
      }
    }
  }
});
