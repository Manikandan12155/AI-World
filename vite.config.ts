import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  // If deploying on Netlify use '/', otherwise default to GitHub Pages repository base '/AI-World/'
  base: process.env.NETLIFY ? '/' : '/AI-World/',
})

 
