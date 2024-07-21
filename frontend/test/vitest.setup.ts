// vitest-dom adds custom vitest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom#with-vitest
import '@testing-library/jest-dom/vitest';

import { server } from '@test/api/servers/server';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' }); // Enable the mocking in tests.
});

beforeEach(() => {
  // Calling a mock will affect other test's `toBeCalledTimes` etc without this.
  // cf. https://vitest.dev/guide/mocking#mocking
  // cf. https://vitest.dev/config/#clearmocks
  vi.clearAllMocks();
});

afterEach(() => {
  server.resetHandlers(); // Reset any runtime handlers tests may use.
});

afterAll(() => {
  server.close(); // Clean up once the tests are done.
});
