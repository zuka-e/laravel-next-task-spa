import { memo, useCallback, useState } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Grid, TextField } from '@mui/material';

import { useGetSessionQuery } from '@/store/api';
import { UpdateProfileRequest, updateProfile } from '@/store/thunks/auth';
import { useAppDispatch } from '@/utils/hooks';
import { isGuest } from '@/utils/auth';
import { AlertMessage, SubmitButton } from '@/templates';

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
  const { user } = useGetSessionQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      user: result.data?.user,
    }),
  });
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState<string | undefined>('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onBlur', resolver: yupResolver(schema) });

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
        setMessage('プロフィールが変更されておりません');
        return;
      }

      const response = await dispatch(updateProfile(data));
      if (updateProfile.rejected.match(response))
        setMessage(response.payload?.error?.message);
      else setMessage('');
    },
    [dispatch, user]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {message && <AlertMessage severity="error" body={message} />}
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            disabled={isGuest()}
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
            disabled={isGuest()}
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
        {!isGuest() && (
          <Grid item>
            <SubmitButton>プロフィールを更新する</SubmitButton>
          </Grid>
        )}
      </Grid>
    </form>
  );
});

export default UserProfile;
