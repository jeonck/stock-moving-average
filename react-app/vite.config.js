import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/stock-moving-average/',
  server: {
    port: 5173,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    target: 'es2015',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          plotly: ['plotly.js', 'react-plotly.js'],
          utils: ['axios']
        }
      }
    }
  },
  define: {
    'process.env': '{}',
    'global': 'globalThis',
    '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })'
  },
  optimizeDeps: {
    include: ['buffer', 'process', 'plotly.js', 'react-plotly.js']
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
      stream: 'stream-browserify',
      assert: 'assert',
      util: 'util'
    }
  }
})