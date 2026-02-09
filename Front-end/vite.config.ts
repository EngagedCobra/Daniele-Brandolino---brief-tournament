import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { devtools } from '@tanstack/devtools-vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), devtools()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

