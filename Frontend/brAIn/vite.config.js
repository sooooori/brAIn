import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all IPs (0.0.0.0)
    port: 4173, // Default Vite port
  }
});