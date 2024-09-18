import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import yaml from 'vite-plugin-yaml';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.ts', '.js'], // Ensure both `.ts` and `.js` files are resolved
  },
})
