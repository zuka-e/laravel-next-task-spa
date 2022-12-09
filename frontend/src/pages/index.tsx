import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { Container } from '@mui/material';

import { fetchAuthUser } from 'store/thunks/auth';
import { isReady, isSignedIn } from 'utils/auth';
import { useAppDispatch, useAppSelector } from 'utils/hooks';
import { BaseLayout, Loading } from 'layouts';
import { LinkButton } from 'templates';
import { SEO } from 'components/pages';
import { Hero, Features } from 'components/home/LandingPage';

const Home = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isReady()) dispatch(fetchAuthUser());
  }, [dispatch]);

  useEffect(() => {
    // Right after `fetchAuthUser.rejected` is dispatched in `useEffect` cleanup,
    // (cf. `pages/419.tsx`),
    // the state using `useSelector` won't be updated,
    // while that using `store.getState()` will be updated.
    // That's why `isSignedIn` is used instead of `useSelector`.
    if (isSignedIn() && user) router.replace(`users/${user.id}/boards`);
  }, [router, user]);

  // Until initialized or the redirect completed.
  if (!isReady() || isSignedIn()) return <Loading open={true} />;

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
};

export default Home;
