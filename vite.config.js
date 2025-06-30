import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // or use '0.0.0.0', same effect
    port: 5173,       // optional: specify custom port
    strictPort: true, // fail if port is taken, instead of switching
  }
})
