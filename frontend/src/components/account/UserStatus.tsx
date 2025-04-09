import { memo, type JSX } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { isVerified } from '@/lib/auth';
import {
  useGetSessionQuery,
  useRequestVerificationEmailMutation,
} from '@/store/api';
import { AlertMessage } from '@/templates';

const UserStatus = memo(function UserProfile(): JSX.Element {
  const { data: { user } = {} } = useGetSessionQuery();
  const [requestVerificationEmail] = useRequestVerificationEmailMutation();

  if (!user) {
    return <></>;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {isVerified(user) ? (
          <AlertMessage severity="success" body="認証済みです" />
        ) : (
          <>
            <AlertMessage severity="warning">
              <Typography variant="body2">{`メール認証が必要です。`}</Typography>
              <Typography variant="body2" paragraph className="font-bold">
                {`登録から24時間以内に認証を完了させなかった場合、一定時間経過後に登録が抹消されます。`}
              </Typography>
              <Typography variant="body2">
                {`登録日時 ${dayjs(user.createdAt).format('YYYY/MM/DD HH:mm')}`}
              </Typography>
            </AlertMessage>
          </>
        )}
      </Grid>
      {!isVerified(user) && (
        <Grid item>
          <Button
            onClick={() => requestVerificationEmail()}
            variant="contained"
            color="secondary"
          >
            メールを再送信する
          </Button>
        </Grid>
      )}
    </Grid>
  );
});

export default UserStatus;
