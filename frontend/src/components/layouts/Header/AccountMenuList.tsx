import { memo, useCallback } from 'react';
import Router from 'next/router';

import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';

import { useGetSessionQuery, useLogoutMutation } from '@/store/api';
import { Fieldset } from '@/templates';

const AccountMenuList = memo(function AccountMenuList(): JSX.Element {
  const { username } = useGetSessionQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      username: result.data?.user?.name,
    }),
  });

  const [logout, { isLoading }] = useLogoutMutation();

  const handleClick = useCallback((path: string): void => {
    Router.push(path);
  }, []);

  const handleLogout = useCallback((): void => {
    logout();
  }, [logout]);

  return (
    <Fieldset disabled={isLoading}>
      <List component="nav" aria-label="account-menu">
        <ListItem
          button
          onClick={() => handleClick('/account')}
          title={username}
        >
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary={username} />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="ログアウト" />
        </ListItem>
      </List>
    </Fieldset>
  );
});

export default AccountMenuList;
