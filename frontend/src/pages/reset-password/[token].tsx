import { memo, useCallback, useEffect, useState, type JSX } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { GetStaticPaths, GetStaticProps } from 'next';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Button,
  TextField,
  Divider,
  Grid,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

import {
  type ResetPasswordRequest,
  useResetPasswordMutation,
} from '@/store/api';
import { useRoute } from '@/utils/hooks';
import { FormLayout } from '@/layouts';
import { SubmitButton } from '@/templates';
import type { GuestPage } from '@/routes';

type FormData = ResetPasswordRequest;

const formData = {
  password: {
    id: 'new-password',
    label: 'New Password',
  },
  passwordConfirmation: {
    id: 'password-confirmation',
    label: 'Password Confirmation',
  },
};

const schema = yup.object().shape({
  password: yup
    .string()
    .label(formData.password.label)
    .required()
    .min(8)
    .max(20),
  passwordConfirmation: yup
    .string()
    .label(formData.passwordConfirmation.label)
    .oneOf([yup.ref('password'), null], 'Passwords do not match'),
});

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

type ResetPasswordProps = GuestPage;

export const getStaticProps: GetStaticProps<ResetPasswordProps> = async () => {
  return {
    props: {
      guest: true,
    },
    revalidate: 10,
  };
};

const ResetPassword = memo(function ResetPassword(): JSX.Element {
  const router = useRouter();
  const route = useRoute();
  const [resetPassword, { error }] = useResetPasswordMutation();
  const [visiblePassword, setVisiblePassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset({
      email: route.queryParams?.email?.toString() ?? '',
      token: route.pathParams?.token?.toString() ?? '',
    });
  }, [reset, route.pathParams?.token, route.queryParams?.email]);

  const togglePasswordVisibility = useCallback((): void => {
    setVisiblePassword((prev) => !prev);
  }, []);

  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>
      <FormLayout
        title={'Reset Password'}
        error={error}
        isLoading={isSubmitting}
        onSubmit={handleSubmit(resetPassword)}
      >
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
        <TextField
          variant="outlined"
          // margin='normal'
          required
          fullWidth
          id={formData.passwordConfirmation.id}
          label={formData.passwordConfirmation.label}
          type={visiblePassword ? 'text' : 'password'}
          autoComplete={formData.passwordConfirmation.id}
          {...register('passwordConfirmation')}
          helperText={
            errors?.passwordConfirmation?.message || 'Retype password'
          }
          error={!!errors?.passwordConfirmation}
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
        <div className="my-8">
          <SubmitButton fullWidth>{'Reset Password'}</SubmitButton>
        </div>
        <Divider className="my-4" />
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Button
              color="info"
              variant="text"
              size="small"
              onClick={() => router.push('/')}
            >
              {'Cancel'}
            </Button>
          </Grid>
        </Grid>
      </FormLayout>
    </>
  );
});

export default ResetPassword;
