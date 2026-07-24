import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['@react-three/fiber', 'three', 'react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['@react-three/fiber', 'three', 'react', 'react-dom'],
  },
})
