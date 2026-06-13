import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Telegram Mini App — static SPA (no SSR). `host: true` so a tunnel (ngrok/
// cloudflared) can reach the dev server for testing inside Telegram.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5174,
  },
});
