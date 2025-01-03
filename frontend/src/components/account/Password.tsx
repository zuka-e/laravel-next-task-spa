import { memo, useCallback, useState, type JSX } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Checkbox, FormControlLabel, Grid, TextField } from '@mui/material';

import {
  UpdatePasswordRequest,
  useGetSessionQuery,
  useUpdatePasswordMutation,
} from '@/store/api';
import { isGuest } from '@/lib/auth';
import { AlertMessage, SubmitButton } from '@/templates';
import { isInvalidRequest, makeErrorMessageFrom } from '@/utils/api/errors';

type FormData = UpdatePasswordRequest;

const formData: Record<keyof FormData, { id: string; label: string }> = {
  currentPassword: {
    id: 'current-password',
    label: 'Current Password',
  },
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
  currentPassword: yup
    .string()
    .label(formData.currentPassword.label)
    .required(),
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

const Password = memo(function Password(): JSX.Element {
  const { data: { user } = {} } = useGetSessionQuery();
  const [updatePassword] = useUpdatePasswordMutation();
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [message, setMessage] = useState<string | undefined>('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onBlur', resolver: yupResolver(schema) });

  const togglePasswordVisibility = useCallback((): void => {
    setVisiblePassword((prev) => !prev);
  }, []);

  // エラー発生時はメッセージを表示する
  const onSubmit = useCallback(
    async (data: FormData): Promise<void> => {
      updatePassword(data)
        .unwrap()
        .then(() => {
          reset();
        })
        .catch((error) => {
          if (isInvalidRequest(error)) {
            setMessage(makeErrorMessageFrom(error));
          }
        });
    },
    [reset, updatePassword]
  );

  if (!user) {
    return <></>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {message && <AlertMessage severity="error" body={message} />}
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            disabled={isGuest(user)}
            variant="outlined"
            fullWidth
            id={formData.currentPassword.id}
            label={formData.currentPassword.label}
            type={visiblePassword ? 'text' : 'password'}
            autoComplete={formData.currentPassword.id}
            {...register('currentPassword')}
            helperText={errors?.currentPassword?.message || ' '}
            error={!!errors?.currentPassword}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <TextField
            disabled={isGuest(user)}
            variant="outlined"
            fullWidth
            id={formData.password.id}
            label={formData.password.label}
            type={visiblePassword ? 'text' : 'password'}
            autoComplete={formData.password.id}
            {...register('password')}
            helperText={errors?.password?.message || '8-20 characters'}
            error={!!errors?.password}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            disabled={isGuest(user)}
            variant="outlined"
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
        </Grid>
      </Grid>
      <FormControlLabel
        label="Show Password"
        control={
          <Checkbox
            onChange={togglePasswordVisibility}
            color="primary"
            size="small"
          />
        }
        className="mx-0 mb-4 block w-fit text-gray-600"
      />
      {!isGuest(user) && <SubmitButton>パスワードを変更する</SubmitButton>}
    </form>
  );
});

export default Password;
