import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  // Default to '/' for Vercel, Netlify & root domain hosts. Use '/AI-World/' only when building on GitHub Actions.
  base: (process.env.VERCEL || process.env.NETLIFY || !process.env.GITHUB_ACTIONS) ? '/' : '/AI-World/',
})

 
