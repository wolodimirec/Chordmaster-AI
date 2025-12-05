import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Pobierz zmienne środowiskowe (np. z Vercel settings)
  // Cast process to any to avoid "Property 'cwd' does not exist on type 'Process'" error
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // To jest kluczowe: Vite zastąpi "process.env.API_KEY" w kodzie rzeczywistą wartością podczas budowania
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
    server: {
      host: true
    }
  };
});