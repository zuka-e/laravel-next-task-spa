import { useState } from 'react';

import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { TextField, Button, Divider, Grid, Box } from '@material-ui/core';

import {
  ResetPasswordRequest,
  resetPassword,
  signInWithEmail,
} from 'store/thunks/auth';
import { useAppDispatch, useQuery } from 'utils/hooks';
import { BaseLayout, FormLayout } from 'layouts';
import { LabeledCheckbox, SubmitButton } from 'templates';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    link: {
      color: theme.palette.info.dark,
    },
  })
);

type FormData = ResetPasswordRequest;

const formdata = {
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
    .label(formdata.password.label)
    .required()
    .min(8)
    .max(20),
  password_confirmation: yup
    .string()
    .label(formdata.password_confirmation.label)
    .oneOf([yup.ref('password'), null], 'Passwords do not match'),
});

const ResetPassword = () => {
  const classes = useStyles();
  const query = useQuery();
  const history = useHistory();
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
      email: query.get('email') || '',
      token: query.get('token') || '',
    },
    // `defaultValues`はフォーム入力では変更不可
  });

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
    <BaseLayout subtitle='Reset Password' withoutHeaders>
      <FormLayout title={'Reset Password'} message={message}>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id={formdata.password.id}
            label={formdata.password.label}
            type={visiblePassword ? 'text' : 'password'}
            autoComplete={formdata.password.id}
            {...register('password')}
            helperText={errors?.password?.message || '8-20 characters'}
            error={!!errors?.password}
          />
          <TextField
            variant='outlined'
            // margin='normal'
            required
            fullWidth
            id={formdata.password_confirmation.id}
            label={formdata.password_confirmation.label}
            type={visiblePassword ? 'text' : 'password'}
            autoComplete={formdata.password_confirmation.id}
            {...register('password_confirmation')}
            helperText={
              errors?.password_confirmation?.message || 'Retype password'
            }
            error={!!errors?.password_confirmation}
          />
          <Box ml={1} mb={2}>
            <LabeledCheckbox
              label='Show Password'
              checked={visiblePassword}
              setChecked={setVisiblePassword}
            />
          </Box>
          <Box mt={4} mb={3}>
            <SubmitButton fullWidth>Reset Password</SubmitButton>
          </Box>
          <Box mt={1} mb={2}>
            <Divider />
          </Box>
          <Grid container justify='flex-end'>
            <Grid item>
              <Button size='small' onClick={() => history.push('/')}>
                <span className={classes.link}>Cancel</span>
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormLayout>
    </BaseLayout>
  );
};

export default ResetPassword;
