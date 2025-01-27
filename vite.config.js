import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Function to copy .well-known directory
function copyWellKnown() {
  return {
    name: 'copy-well-known',
    closeBundle() {
      const wellKnownDir = path.resolve('public/.well-known')
      const outDir = path.resolve('dist/.well-known')

      if (fs.existsSync(wellKnownDir)) {
        fs.cpSync(wellKnownDir, outDir, { recursive: true })
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), copyWellKnown()],
  server: {
    // Handle .well-known in development
    proxy: {
      '/.well-known': {
        target: 'http://localhost:5173',
        rewrite: (path) => `/public${path}`
      }
    }
  }
})