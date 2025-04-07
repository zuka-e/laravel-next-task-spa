import { memo, useCallback, useState, type JSX } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { GetStaticProps } from 'next';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Divider,
  Grid,
} from '@mui/material';

import { APP_NAME } from '@/config/app';
import { useLoginMutation, type LoginRequest } from '@/store/api';
import { FormLayout } from '@/layouts';
import type { GuestPage } from '@/routes';

type FormData = LoginRequest;

const formData: Record<keyof FormData, { id: string; label: string }> = {
  email: {
    id: 'email',
    label: 'Email Address',
  },
  password: {
    id: 'password',
    label: 'Password',
  },
  remember: {
    id: 'remember',
    label: 'Remember me',
  },
};

const schema = yup.object().shape({
  email: yup.string().label(formData.email.label).email().required(),
  password: yup
    .string()
    .label(formData.password.label)
    .required()
    .min(8)
    .max(20),
  remember: yup.boolean().label(formData.remember.label).required(),
});

type LoginProps = GuestPage;

export const getStaticProps: GetStaticProps<LoginProps> = async () => {
  return {
    props: {
      guest: true,
    },
    revalidate: 10,
  };
};

const SignIn = memo(function SignIn(): JSX.Element {
  const [login, { isLoading, error }] = useLoginMutation();
  const [visiblePassword, setVisiblePassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur', resolver: yupResolver(schema) });

  const togglePasswordVisibility = useCallback((): void => {
    setVisiblePassword((prev) => !prev);
  }, []);

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <FormLayout
        title={`Sign in to ${APP_NAME}`}
        error={error}
        isLoading={isLoading}
        onSubmit={handleSubmit(login)}
      >
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id={formData.email.id}
          label={formData.email.label}
          autoComplete={formData.email.id}
          {...register('email')}
          helperText={errors?.email?.message}
          error={!!errors?.email}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id={formData.password.id}
          label={formData.password.label}
          type={visiblePassword ? 'text' : 'password'}
          autoComplete={formData.password.id}
          {...register('password')}
          helperText={errors?.password?.message || '8-20 characters'}
          error={!!errors?.password}
        />
        <FormControlLabel
          label="Show Password"
          className="mx-0 mb-4 block w-fit text-gray-600"
          control={
            <Checkbox
              onChange={togglePasswordVisibility}
              color="primary"
              size="small"
            />
          }
        />
        <FormControlLabel
          id={formData.remember.id}
          label={formData.remember.label}
          control={
            <Checkbox {...register('remember')} value="on" color="primary" />
          }
        />
        <div className="my-8">
          <Button fullWidth type="submit" color="primary" variant="contained">
            {'Sign In'}
          </Button>
        </div>
        <Button
          color="info"
          variant="text"
          size="small"
          onClick={() => router.push('/forgot-password')}
        >
          {'Forgot password?'}
        </Button>
        <Divider className="my-4" />
        <Grid container justifyContent="flex-end">
          <Grid item>
            {`New to ${APP_NAME}? `}
            <Button
              color="info"
              variant="text"
              size="small"
              onClick={() => router.push('/register')}
            >
              {'Create an account'}
            </Button>
          </Grid>
        </Grid>
      </FormLayout>
    </>
  );
});

export default SignIn;
