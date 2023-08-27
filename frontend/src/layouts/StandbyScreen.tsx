import { memo } from 'react';

import { Header, Footer, Progressbar } from '@/layouts';

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
