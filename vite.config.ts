import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  // If deploying on Netlify or root domain use '/', otherwise GitHub Pages uses '/AI-World/'
  base: process.env.NETLIFY ? '/' : (process.env.GITHUB_PAGES === 'true' || process.env.CI ? '/AI-World/' : '/'),
})

 
