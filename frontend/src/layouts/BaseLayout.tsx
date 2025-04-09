import { memo, type JSX } from 'react';

import { Footer, Header } from '@/layouts';

type BaseLayoutProps = {
  children: React.ReactNode;
  withoutHeaders?: boolean;
};

const BaseLayout = memo(function BaseLayout(
  props: BaseLayoutProps,
): JSX.Element {
  return (
    <>
      {!props.withoutHeaders && <Header />}
      {props.children}
      {!props.withoutHeaders && <Footer />}
    </>
  );
});

export default BaseLayout;
