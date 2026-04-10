import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  optimizeDeps: {
    include: ['pdfjs-dist'],
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',
  },
  server: {
    port: 3000,
    open: true,
  },
});
