import { Header, Footer } from '@/layouts';

type BaseLayoutProps = {
  children: React.ReactNode;
  withoutHeaders?: boolean;
};

const BaseLayout = (props: BaseLayoutProps) => (
  <>
    {!props.withoutHeaders && <Header />}
    {props.children}
    {!props.withoutHeaders && <Footer />}
  </>
);

export default BaseLayout;
