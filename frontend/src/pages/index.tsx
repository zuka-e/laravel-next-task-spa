import { memo, useEffect, type JSX } from 'react';
import Router from 'next/router';
import { Container } from '@mui/material';

import { Features, Hero } from '@/components/home/LandingPage';
import { SEO } from '@/components/pages';
import { BaseLayout, Loading } from '@/layouts';
import { useGetSessionQuery } from '@/store/api';
import { LinkButton } from '@/templates';

const Home = memo(function Home(): JSX.Element {
  const { userId, isUninitialized } = useGetSessionQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      userId: result.data?.user?.id,
    }),
  });

  useEffect(() => {
    if (userId) {
      Router.replace('/boards');
    }
  }, [userId]);

  // Until initialized or the redirect completed.
  if (isUninitialized || userId) {
    return <Loading open={true} />;
  }

  return (
    <>
      <SEO title="" description="" />
      <BaseLayout>
        <main className="bg-image-secondary">
          <Container className="relative my-24 sm:min-h-[75vh]">
            <Hero />
          </Container>
        </main>
        <section className="bg-image-primary py-24">
          <Container className="flex flex-col justify-between gap-24 sm:min-h-[80vh]">
            <div className="flex-auto">
              <Features />
            </div>
            <div className="mx-auto w-80">
              <LinkButton to="/register" size="large" fullWidth>
                始める
              </LinkButton>
            </div>
          </Container>
        </section>
      </BaseLayout>
    </>
  );
});

export default Home;
