import { memo, useCallback } from 'react';
import Router from 'next/router';

import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';

import { signOut } from '@/store/thunks/auth';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';

const AccountMenuList = memo(function AccountMenuList(): JSX.Element {
  const username = useAppSelector((state) => state.auth.user?.name);
  const dispatch = useAppDispatch();

  const handleClick = useCallback((path: string): void => {
    Router.push(path);
  }, []);

  const handleSignOut = useCallback((): void => {
    dispatch(signOut());
  }, [dispatch]);

  return (
    <List component="nav" aria-label="account-menu">
      <ListItem button onClick={() => handleClick('/account')} title={username}>
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText primary={username} />
      </ListItem>
      <ListItem button onClick={handleSignOut}>
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary="ログアウト" />
      </ListItem>
    </List>
  );
});

export default AccountMenuList;
