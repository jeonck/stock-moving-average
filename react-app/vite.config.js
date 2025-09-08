import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 배포용 - 저장소 이름에 맞게 수정 필요
  base: process.env.NODE_ENV === 'production' ? '/stock-moving-average/' : '/',
  server: {
    port: 5173,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          plotly: ['plotly.js', 'react-plotly.js'],
          utils: ['axios', 'date-fns']
        }
      }
    }
  },
  define: {
    'process.env': {}
  }
})