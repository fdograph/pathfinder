import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const basePath = process.env.VITE_BASE_PATH ?? '';

// https://vitejs.dev/config/
export default defineConfig({
  base: basePath,
  plugins: [react()],
});
