import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    AutoImport({
      dts: true,
      include: [
        /\.ts$/
      ],
      dirs: [
        './src/constants',
        './src/entities',
      ]
    })
  ],
  server: {
    hmr: {
      path: '/hmr',
      clientPort: 443,
      protocol: 'wss'
    }
  }
})