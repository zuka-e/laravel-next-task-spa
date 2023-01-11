// https://nextjs.org/docs/advanced-features/custom-app
// https://nextjs.org/docs/basic-features/typescript#custom-app
// https://nextjs.org/docs/messages/no-document-viewport-meta
// e.g. https://github.com/vercel/next.js/blob/canary/examples/with-redux/src/pages/_app.tsx

import { AppProps } from 'next/app';
import Head from 'next/head';

import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CssBaseline from '@mui/material/CssBaseline';

import { APP_NAME } from '@/config/app';
import store from '@/store';
import theme from '@/theme';
import { FlashNotification, Loading } from '@/layouts';
import { PageHandler } from '@/components/pages';

import '@/styles/globals.css';
import '@/config/dayjs';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  // With `import` instead of `require`, API requests start before MSW enabled,
  // probably because "import(...)" is async. ("await import" have the same result)
  require('@test/data');
  require('@test/api/servers');
}

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        {/* https://nextjs.org/docs/messages/no-document-viewport-meta */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* https://nextjs.org/docs/messages/no-document-title */}
        <title>{APP_NAME}</title>
      </Head>
      <Provider store={store}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DndProvider backend={HTML5Backend}>
                <CssBaseline />
                <Loading />
                <FlashNotification />
                <PageHandler {...{ Component, pageProps }} />
              </DndProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </Provider>
    </>
  );
};

export default App;
