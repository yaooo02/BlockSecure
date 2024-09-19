import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',  // Ensure 'dist' is the output folder
  },
  plugins: [react()],
  resolve: {
    extensions: ['.ts', '.js'], // Ensure both `.ts` and `.js` files are resolved
  },
})
