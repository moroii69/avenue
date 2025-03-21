import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Permissions-Policy': 'partitioned-cookies=()',
      'Cross-Origin-Opener-Policy': 'same-origin',
      "Content-Security-Policy": "frame-ancestors 'self' https://pay.google.com/;",
    },
    proxy: {
      // Proxy PostHog requests to avoid CORS issues
      '/posthog-proxy': {
        target: 'https://us.i.posthog.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/posthog-proxy/, ''),
        secure: true,
        ws: true
      }
    }
  },
})