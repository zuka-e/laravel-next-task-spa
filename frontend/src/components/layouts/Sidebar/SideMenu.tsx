import { memo, useCallback, useMemo } from 'react';
import Router from 'next/router';

import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  Folder as FolderIcon,
  ExitToApp as ExitToAppIcon,
  PersonAdd as PersonAddIcon,
  PersonAddOutlined as PersonAddOutlinedIcon,
  LockOpen as LockOpenIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';

import { GUEST_EMAIL, GUEST_PASSWORD } from '@/config/app';
import { makeEmail } from '@/utils/generator';
import { useAppDispatch } from '@/utils/hooks';
import {
  useGetSessionQuery,
  useLoginMutation,
  useLogoutMutation,
} from '@/store/api';
import { createUser } from '@/store/thunks/auth';
import { Fieldset } from '@/templates';

const SideMenu = memo(function SideMenu(): JSX.Element {
  const { userId } = useGetSessionQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      userId: result.data?.user?.id,
    }),
  });

  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();

  const dispatch = useAppDispatch();

  const isLoading = useMemo(
    (): boolean => loginLoading || logoutLoading,
    [loginLoading, logoutLoading]
  );

  const menuItem = useMemo(() => {
    return userId
      ? ({
          boards: 'ボードを表示',
          logout: 'ログアウト',
        } as const)
      : ({
          register: '登録',
          login: 'ログイン',
          guestRegister: 'ゲストとして登録',
          guestLogin: 'ゲストログイン',
        } as const);
  }, [userId]);

  const renderIcon = (key: keyof typeof menuItem) => {
    if (key === 'boards') return <FolderIcon />;
    if (key === 'logout') return <ExitToAppIcon />;

    if (key === 'register') return <PersonAddIcon />;
    if (key === 'login') return <LockOpenIcon />;
    if (key === 'guestRegister') return <PersonAddOutlinedIcon />;
    if (key === 'guestLogin') return <AccountCircleIcon />;
  };

  const handleClick = useCallback(
    (key: keyof typeof menuItem): void => {
      switch (key) {
        case 'boards':
          Router.push(`/users/${userId}/boards`);
          break;
        case 'logout':
          logout();
          break;

        case 'register':
          Router.push('register');
          break;
        case 'login':
          Router.push('login');
          break;
        case 'guestRegister':
          Router.push('/register'); // `EmailVerification`を表示するため
          dispatch(
            createUser({
              email: makeEmail(),
              password: GUEST_PASSWORD,
              password_confirmation: GUEST_PASSWORD,
            })
          );
          break;
        case 'guestLogin':
          login({ email: GUEST_EMAIL, password: GUEST_PASSWORD });
          break;
      }
    },
    [dispatch, login, logout, userId]
  );

  return (
    <Fieldset disabled={isLoading}>
      {(Object.keys(menuItem) as (keyof typeof menuItem)[]).map((key) => (
        <ListItem key={key} button onClick={() => handleClick(key)}>
          <ListItemIcon>{renderIcon(key)}</ListItemIcon>
          <ListItemText primary={menuItem[key]} />
        </ListItem>
      ))}
    </Fieldset>
  );
});

export default SideMenu;
