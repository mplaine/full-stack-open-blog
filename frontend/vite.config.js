import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const baseUrl = 'http://localhost:3003'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: baseUrl,
        changeOrigin: true
      },
      '/health': {
        target: baseUrl,
        changeOrigin: true
      }
    }
  }
})
