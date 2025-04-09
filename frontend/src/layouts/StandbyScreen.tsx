import { memo, type JSX } from 'react';

import { Footer, Header, Progressbar } from '@/layouts';

const StandbyScreen = memo(function StandbyScreen(): JSX.Element {
  return (
    <>
      <Header />
      <Progressbar />
      <Footer />
    </>
  );
});

export default StandbyScreen;
