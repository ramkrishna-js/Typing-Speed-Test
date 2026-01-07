import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Typing-Speed-Test/',
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  build: {
    minify: false,
    sourcemap: true,
  },
  plugins: [
    react(),
  ],
})
