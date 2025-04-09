import { memo, type JSX } from 'react';
import type { GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Divider, Grid, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { FormLayout } from '@/layouts';
import type { GuestPage } from '@/routes';
import {
  useForgotPasswordMutation,
  type ForgotPasswordRequest,
} from '@/store/api';
import { SubmitButton } from '@/templates';

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
  } = useForm({ mode: 'onBlur', resolver: yupResolver(schema) });

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
