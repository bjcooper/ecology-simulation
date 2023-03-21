import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    hmr: {
      path: '/hmr',
      clientPort: 443,
      protocol: 'wss'
    }
  }
})