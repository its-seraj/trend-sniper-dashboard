import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ml': {
        target: 'https://api.seraj.live',
        changeOrigin: true,
      },
      '/refinements': {
        target: 'https://api.seraj.live',
        changeOrigin: true,
      },
    },
  },
})
