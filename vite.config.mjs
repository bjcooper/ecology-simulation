import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@src': '/src',
      '@assets': '/public/assets',
    },
  },
  server: {
    port: 8080,
  },
});
