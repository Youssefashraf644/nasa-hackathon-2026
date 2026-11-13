// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      // Any request from React to /api/* gets forwarded to Flask on :5000.
      // Why proxy instead of hardcoding http://127.0.0.1:5000 in fetch():
      //  - No CORS preflight (same-origin from the browser's view).
      //  - One place to change the backend URL.
      //  - Same code works in prod if React and Flask share a host.
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
})