import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // @mui/icons-material ESM files do a directory import of @mui/material/utils
      // which Node's ES module resolver rejects. Point it at the index file directly.
      '@mui/material/utils': path.resolve(
        __dirname,
        '../node_modules/@mui/material/utils/index.js',
      ),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
