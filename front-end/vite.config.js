import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5050,
  },
  plugins: [react()],
  optimizeDeps: {
    include: ['exceljs'],
  },
})
