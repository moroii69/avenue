import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/.well-known/apple-developer-merchantid-domain-association': {
        target: '/apple-developer-merchantid-domain-association',
        rewrite: (path) => '/apple-developer-merchantid-domain-association'
      }
    }
  }
})