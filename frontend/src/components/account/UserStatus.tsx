import dayjs from 'dayjs';
import { Box, Button, Grid, Typography } from '@mui/material';

import { sendEmailVerificationLink } from 'store/thunks/auth';
import { useAppSelector, useAppDispatch } from 'utils/hooks';
import { isVerified } from 'utils/auth';
import { AlertMessage } from 'templates';

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
          <Typography variant="body2" paragraph>
            <strong>
              {`登録から24時間以内に認証を完了させなかった場合、一定時間経過後に登録が抹消されます。`}
            </strong>
          </Typography>
          <Typography variant="body2">
            {`登録日時 ${dayjs(createdAt).format('YYYY/MM/DD HH:mm')}`}
          </Typography>
        </AlertMessage>
        <Box mt={3} mb={1}>
          <Button variant="contained" color="secondary" onClick={handleClick}>
            メールを再送信する
          </Button>
        </Box>
      </>
    );

  return (
    <Grid container>
      <Grid item xs={12}>
        {showEmailVerificationState()}
      </Grid>
    </Grid>
  );
};

export default UserStatus;
