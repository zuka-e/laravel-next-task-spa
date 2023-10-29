import { memo, useCallback } from 'react';
import Image from 'next/image';
import Router from 'next/router';

import {
  Button,
  Unstable_Grid2 as Grid,
  Typography,
  List,
  ListItem,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  LockOpen as LockOpenIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

import { GUEST_EMAIL, GUEST_NAME, GUEST_PASSWORD } from '@/config/app';
import { useLoginMutation } from '@/store/api';
import { createUser } from '@/store/thunks/auth';
import { useAppDispatch } from '@/utils/hooks';
import { makeEmail } from '@/utils/generator';
import { Fieldset, LinkButton, PopoverControl } from '@/templates';
import hero from '@/images/hero.svg';

const Hero = memo(function Hero(): JSX.Element {
  const [login, { isLoading }] = useLoginMutation();

  const dispatch = useAppDispatch();

  const handleGuestSignUp = useCallback(async (): Promise<void> => {
    const user = {
      name: GUEST_NAME,
      email: makeEmail(),
      password: GUEST_PASSWORD,
      password_confirmation: GUEST_PASSWORD,
    };
    await Router.push('/register'); // `EmailVerification`を表示するため
    dispatch(createUser(user));
  }, [dispatch]);

  const handleGuestSignIn = useCallback((): void => {
    login({ email: GUEST_EMAIL, password: GUEST_PASSWORD });
  }, [login]);

  return (
    <Grid
      container
      className="justify-around max-md:flex-col-reverse max-md:items-center max-md:gap-16"
    >
      <Grid md={6}>
        <div className="mb-24 max-md:mb-12 max-md:mt-8">
          <Typography variant="h1" className="mb-12">
            タスク管理で課題を明確化
          </Typography>
          <Typography variant="h4" component="p" color="textSecondary">
            複雑なタスクを視覚的に確認し、現在の状況を把握した上で意思決定に役立てることができます。
          </Typography>
        </div>
        <Fieldset disabled={isLoading}>
          <Grid container spacing={2}>
            <Grid>
              <LinkButton startIcon={<PersonAddIcon />} to="/register">
                登録する
              </LinkButton>
            </Grid>
            <Grid>
              <LinkButton
                startIcon={<LockOpenIcon />}
                color="secondary"
                to="/login"
              >
                ログイン
              </LinkButton>
            </Grid>
            <Grid>
              <PopoverControl
                trigger={
                  <Button
                    startIcon={<MenuIcon />}
                    variant="contained"
                    color="info"
                  >
                    又はゲストユーザーで試す
                  </Button>
                }
              >
                <Fieldset disabled={isLoading}>
                  <List component="nav">
                    <ListItem button onClick={handleGuestSignUp}>
                      登録 (メール認証不可)
                    </ListItem>
                    <ListItem button onClick={handleGuestSignIn}>
                      ログイン (メール認証済み)
                    </ListItem>
                  </List>
                </Fieldset>
              </PopoverControl>
            </Grid>
          </Grid>
        </Fieldset>
      </Grid>
      <Grid xs={10} sm={10} md={5}>
        <div className="relative h-72 w-full">
          <Image src={hero.src} alt="hero" layout="fill" priority />
        </div>
      </Grid>
    </Grid>
  );
});

export default Hero;
