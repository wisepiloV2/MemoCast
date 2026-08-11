import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Estos encabezados son OBLIGATORIOS para que el motor WASM funcione
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  optimizeDeps: {
    // Excluimos la librería para que Vite no la rompa al compilarla en desarrollo
    exclude: ['@mintplex-labs/piper-tts-web']
  }
})