import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, './src/'),
      '@components/': path.resolve(__dirname, './src/components/'),
      '@screens/': path.resolve(__dirname, './src/screens/'),
      '@store/': path.resolve(__dirname, './src/store/'),
      '@hooks/': path.resolve(__dirname, './src/hooks/'),
      '@utils/': path.resolve(__dirname, './src/utils/'),
      '@styles/': path.resolve(__dirname, './src/styles/'),
      '@database/': path.resolve(__dirname, './src/database/'),
      '@engine/': path.resolve(__dirname, './src/engine/'),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})