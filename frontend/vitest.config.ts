import { resolve } from 'path';

import dotenv from 'dotenv';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// cf. https://vitest.dev/config
export default defineConfig({
  // cf. https://nextjs.org/docs/pages/building-your-application/testing/vitest
  plugins: [react()],
  test: {
    globals: true,
    env: dotenv.config({ path: '.env.test' }).parsed,
    environment: 'jsdom',
    setupFiles: ['./test/vitest.setup.ts'],
    alias: {
      '@': resolve(__dirname, './src'),
      '@test': resolve(__dirname, './test'),
    },
    coverage: {
      enabled: true,
    },
  },
});
