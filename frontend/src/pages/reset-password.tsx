import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { GetStaticProps } from 'next';

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
  ResetPasswordRequest,
  resetPassword,
  signInWithEmail,
} from '@/store/thunks/auth';
import { useAppDispatch, useRoute } from '@/utils/hooks';
import { FormLayout } from '@/layouts';
import { SubmitButton } from '@/templates';
import type { GuestPage } from '@/routes';

type FormData = ResetPasswordRequest;

const formData = {
  password: {
    id: 'new-password',
    label: 'New Password',
  },
  password_confirmation: {
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
  password_confirmation: yup
    .string()
    .label(formData.password_confirmation.label)
    .oneOf([yup.ref('password'), null], 'Passwords do not match'),
});

type ResetPasswordProps = GuestPage;

export const getStaticProps: GetStaticProps<ResetPasswordProps> = async () => {
  return {
    props: {
      guest: true,
    },
    revalidate: 10,
  };
};

const ResetPassword = () => {
  const router = useRouter();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [message, setMessage] = useState<string | undefined>('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      email: route.queryParams.email?.toString() ?? '',
      token: route.queryParams.token?.toString() ?? '',
    },
    // `defaultValues`はフォーム入力では変更不可
  });

  const togglePasswordVisibility = () => {
    setVisiblePassword(!visiblePassword);
  };

  // エラー発生時はメッセージを表示する
  const onSubmit = async (data: FormData) => {
    const response = await dispatch(resetPassword(data));
    if (resetPassword.rejected.match(response))
      setMessage(response.payload?.error?.message);
    // 認証成功時は自動ログイン
    else
      dispatch(signInWithEmail({ email: data.email, password: data.password }));
  };

  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>
      <FormLayout
        title={'Reset Password'}
        message={message}
        onSubmit={handleSubmit(onSubmit)}
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
          id={formData.password_confirmation.id}
          label={formData.password_confirmation.label}
          type={visiblePassword ? 'text' : 'password'}
          autoComplete={formData.password_confirmation.id}
          {...register('password_confirmation')}
          helperText={
            errors?.password_confirmation?.message || 'Retype password'
          }
          error={!!errors?.password_confirmation}
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
};

export default ResetPassword;
