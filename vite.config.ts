import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react(),
    // đọc thẳng alias từ tsconfig.json, khỏi phải khai lại trong vite.config.ts
    tsconfigPaths()
  ],
  server: {
    port: 5173,
    open: true
  },
  // nếu bạn không dùng vite-tsconfig-paths thì dùng:
  // resolve: {
  //   alias: { '@': path.resolve(__dirname, 'src') }
  // }
})
