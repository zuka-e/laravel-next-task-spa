import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { defineConfig } from 'vitest/config';

// cf. https://vitest.dev/config
export default defineConfig({
  // cf. https://nextjs.org/docs/pages/building-your-application/testing/vitest
  plugins: [react()],
  test: {
    globals: true,
    env: dotenv.config({ path: '.env.test' }).parsed,
    environment: 'jsdom',
    setupFiles: ['./test/vitest.setup.ts'],
    include: ['./test/__tests__/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    alias: {
      '@': `${import.meta.dirname}/src`,
      '@test': `${import.meta.dirname}/test`,
    },
    coverage: {
      enabled: true,
      include: ['src'],
    },
  },
});
