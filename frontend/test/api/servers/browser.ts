import { StartOptions, setupWorker } from 'msw';

import { handlers } from '../handlers';

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);

/**
 * @see https://mswjs.io/docs/recipes/debugging-uncaught-requests
 */
export const config: StartOptions = {
  onUnhandledRequest(request, print) {
    if (request.url.origin !== process.env.NEXT_PUBLIC_API_HOST) {
      return;
    }

    print.warning();
  },
};
