import { memo, type JSX } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { GetStaticProps } from 'next';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, TextField, Divider, Grid } from '@mui/material';

import {
  type ForgotPasswordRequest,
  useForgotPasswordMutation,
} from '@/store/api';
import { FormLayout } from '@/layouts';
import { SubmitButton } from '@/templates';
import type { GuestPage } from '@/routes';

type FormData = ForgotPasswordRequest;

const formData: Record<keyof FormData, { id: string; label: string }> = {
  email: {
    id: 'email',
    label: 'Email Address',
  },
};

const schema = yup.object().shape({
  email: yup.string().label(formData.email.label).email().required(),
});

type ForgotPasswordProps = GuestPage;

export const getStaticProps: GetStaticProps<ForgotPasswordProps> = async () => {
  return {
    props: {
      guest: true,
    },
    revalidate: 10,
  };
};

const ForgotPassword = memo(function ForgotPassword(): JSX.Element {
  const router = useRouter();
  const [forgotPassword, { error }] = useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ mode: 'onBlur', resolver: yupResolver(schema) });

  return (
    <>
      <Head>
        <title>Forgot Password</title>
      </Head>
      <FormLayout
        title={'Forgot Password?'}
        error={error}
        isLoading={isSubmitting}
        onSubmit={handleSubmit(forgotPassword)}
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
        <div className="my-8">
          <SubmitButton fullWidth>{'Send password reset email'}</SubmitButton>
        </div>
        <Divider className="my-4" />
        <Grid container justifyContent="flex-end">
          <Grid item>
            {'Back to'}
            <Button
              color="info"
              variant="text"
              size="small"
              onClick={() => router.push('/login')}
            >
              {'Sign in'}
            </Button>
          </Grid>
        </Grid>
      </FormLayout>
    </>
  );
});

export default ForgotPassword;
