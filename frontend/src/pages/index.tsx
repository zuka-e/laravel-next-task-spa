import { memo, useEffect } from 'react';
import Router from 'next/router';

import { Container } from '@mui/material';

import { useAuth } from '@/utils/hooks';
import { BaseLayout, Loading } from '@/layouts';
import { LinkButton } from '@/templates';
import { SEO } from '@/components/pages';
import { Hero, Features } from '@/components/home/LandingPage';

const Home = memo(function Home(): JSX.Element {
  const { user, guest } = useAuth();

  useEffect(() => {
    if (user) {
      Router.replace(`users/${user.id}/boards`);
    }
  }, [user]);

  // Until initialized or the redirect completed.
  if (!guest) return <Loading open={true} />;

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
