import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vite + Vitest config for React
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    // Use an array for setupFiles; ensure this file imports '@testing-library/jest-dom'
    setupFiles: ['./src/setupTests.ts'],
    // Uncomment if you want coverage
    // coverage: { provider: 'v8', reporter: ['text', 'html'] },
  },
});