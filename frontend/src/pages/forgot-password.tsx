import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { GetStaticProps } from 'next';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, TextField, Divider, Grid } from '@mui/material';

import { ForgotPasswordRequest, forgotPassword } from '@/store/thunks/auth';
import { useAppDispatch } from '@/utils/hooks';
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

const ForgotPassword = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState<string | undefined>('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onBlur', resolver: yupResolver(schema) });

  // エラー発生時はメッセージを表示する
  const onSubmit = async (data: FormData) => {
    const response = await dispatch(forgotPassword(data));
    if (forgotPassword.rejected.match(response))
      setMessage(response.payload?.error?.message);
    else setMessage('');
  };

  return (
    <>
      <Head>
        <title>Forgot Password</title>
      </Head>
      <FormLayout
        title={'Forgot Password?'}
        message={message}
        onSubmit={handleSubmit(onSubmit)}
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
};

export default ForgotPassword;
