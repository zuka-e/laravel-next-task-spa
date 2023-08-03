import dayjs from 'dayjs';
import { Button, Grid, Typography } from '@mui/material';

import { sendEmailVerificationLink } from '@/store/thunks/auth';
import { useAppSelector, useAppDispatch } from '@/utils/hooks';
import { isVerified } from '@/utils/auth';
import { AlertMessage } from '@/templates';

const UserStatus = () => {
  const createdAt = useAppSelector((state) => state.auth.user?.createdAt);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(sendEmailVerificationLink());
  };

  if (!createdAt) throw new Error();

  const showEmailVerificationState = () =>
    isVerified() ? (
      <AlertMessage severity="success" body="認証済みです" />
    ) : (
      <>
        <AlertMessage severity="warning">
          <Typography variant="body2">{`メール認証が必要です。`}</Typography>
          <Typography variant="body2" paragraph className="font-bold">
            {`登録から24時間以内に認証を完了させなかった場合、一定時間経過後に登録が抹消されます。`}
          </Typography>
          <Typography variant="body2">
            {`登録日時 ${dayjs(createdAt).format('YYYY/MM/DD HH:mm')}`}
          </Typography>
        </AlertMessage>
      </>
    );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {showEmailVerificationState()}
      </Grid>
      {!isVerified() && (
        <Grid item>
          <Button onClick={handleClick} variant="contained" color="secondary">
            メールを再送信する
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default UserStatus;
