import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
  build: {
    // Cloud deploys only backend/. The production SPA has to be inside its public directory.
    outDir: '../backend/public',
    emptyOutDir: false,
  },
})
