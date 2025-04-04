import { memo, useCallback, useMemo, type JSX } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Grid, TextField } from '@mui/material';

import {
  type UpdateProfileRequest,
  useGetSessionQuery,
  useUpdateProfileMutation,
} from '@/store/api';
import { isGuest } from '@/lib/auth';
import { AlertMessage, SubmitButton } from '@/templates';
import { isInvalidRequest, makeErrorMessageFrom } from '@/utils/api/errors';

type FormData = UpdateProfileRequest;

const formData: Record<keyof FormData, { id: string; label: string }> = {
  name: {
    id: 'name',
    label: 'Username',
  },
  email: {
    id: 'email',
    label: 'Email Address',
  },
};

const schema = yup.object().shape({
  name: yup.string().label(formData.name.label).min(1).max(255),
  email: yup.string().label(formData.email.label).email().max(255),
});

const UserProfile = memo(function UserProfile(): JSX.Element {
  const { data: { user } = {} } = useGetSessionQuery();
  const [updateProfile, { error }] = useUpdateProfileMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onBlur', resolver: yupResolver(schema) });

  const errorMessage = useMemo((): string | null => {
    return isInvalidRequest(error) ? makeErrorMessageFrom(error) : null;
  }, [error]);

  // エラー発生時はメッセージを表示する
  const onSubmit = useCallback(
    async (data: FormData): Promise<void> => {
      if (!user) {
        return;
      }
      // フォーカスを当てていない場合`defaultValue`でなく`undefined`となる
      // その場合変更点がないので現在の値をセットする
      if (!data.name) data.name = user.name;
      if (!data.email) data.email = user.email;

      // 全ての項目で変更点がない場合はリクエストを送らない
      if (data.name === user?.name && data.email === user?.email) {
        return;
      }

      updateProfile(data);
    },
    [updateProfile, user],
  );

  if (!user) {
    return <></>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {errorMessage && (
            <AlertMessage severity="error" body={errorMessage} />
          )}
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            disabled={isGuest(user)}
            variant="outlined"
            fullWidth
            id={formData.name.id}
            label={formData.name.label}
            autoComplete={formData.name.id}
            defaultValue={user?.name}
            {...register('name')}
            helperText={errors?.name?.message || '1-255 characters'}
            error={!!errors?.name}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            disabled={isGuest(user)}
            variant="outlined"
            fullWidth
            id={formData.email.id}
            label={formData.email.label}
            autoComplete={formData.email.id}
            defaultValue={user?.email}
            {...register('email')}
            helperText={errors?.email?.message}
            error={!!errors?.email}
          />
        </Grid>
        {!isGuest(user) && (
          <Grid item>
            <SubmitButton>プロフィールを更新する</SubmitButton>
          </Grid>
        )}
      </Grid>
    </form>
  );
});

export default UserProfile;
