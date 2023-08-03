// cf. https://nextjs.org/docs/advanced-features/custom-error-page

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';

import { useAppSelector } from '@/utils/hooks';
import BadRequest from '@/pages/400';
import Forbidden from '@/pages/403';
import NotFound from '@/pages/404';
import PageExpired from '@/pages/419';
import TooManyRequests from '@/pages/429';
import InternalServerError from '@/pages/500';
import ServiceUnavailable from '@/pages/503';
import { clearHttpStatus } from '@/store/slices';
import { useAppDispatch } from '@/utils/hooks';

type ErrorHandlerProps = {
  children: React.ReactNode;
};

const isHttpError = (httpStatus: number): boolean => {
  return 400 <= httpStatus && httpStatus < 600;
};

const isRenderableError = (httpStatus: number): boolean => {
  const excluded = [401, 422];
  return isHttpError(httpStatus) && !excluded.includes(httpStatus);
};

const ErrorHandler = ({ children }: ErrorHandlerProps) => {
  const httpStatus = useAppSelector((state) => state.app.httpStatus);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect((): (() => void) => {
    return function cleanup() {
      dispatch(clearHttpStatus());
    };
  }, [dispatch, router.asPath]);

  if (!httpStatus || !isRenderableError(httpStatus)) {
    return <>{children}</>;
  }

  switch (httpStatus) {
    case 400:
      return <BadRequest />;
    case 403:
      return <Forbidden />;
    case 404:
    case 405:
      return <NotFound />;
    case 419:
      return <PageExpired />;
    case 429:
      return <TooManyRequests />;
    case 500:
      return <InternalServerError />;
    case 503:
      return <ServiceUnavailable />;
    default:
      return <Error statusCode={httpStatus} />;
  }
};

export default ErrorHandler;
