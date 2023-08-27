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
import { useAppSelector, useAppDispatch } from '@/utils/hooks';
import { createUser, signInWithEmail, signOut } from '@/store/thunks/auth';

const SideMenu = memo(function SideMenu(): JSX.Element {
  const userId = useAppSelector((state) => state.auth.user?.id);
  const dispatch = useAppDispatch();

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
          dispatch(signOut());
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
          dispatch(
            signInWithEmail({ email: GUEST_EMAIL, password: GUEST_PASSWORD })
          );
          break;
      }
    },
    [dispatch, userId]
  );

  return (
    <>
      {(Object.keys(menuItem) as (keyof typeof menuItem)[]).map((key) => (
        <ListItem key={key} button onClick={() => handleClick(key)}>
          <ListItemIcon>{renderIcon(key)}</ListItemIcon>
          <ListItemText primary={menuItem[key]} />
        </ListItem>
      ))}
    </>
  );
});

export default SideMenu;
