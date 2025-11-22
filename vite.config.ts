import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Necessário para o Google GenAI SDK funcionar no frontend simulando process.env
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || process.env.API_KEY),
      'process.env': {} 
    },
    server: {
      port: 3000,
    }
  }
})
