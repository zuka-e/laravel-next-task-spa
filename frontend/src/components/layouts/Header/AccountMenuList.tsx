import { useRouter } from 'next/router';

import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';

import { signOut } from 'store/thunks/auth';
import { useAppDispatch, useAppSelector } from 'utils/hooks';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxWidth: '300px',
      overflowWrap: 'break-word',
    },
  })
);

const AccountMenuList = () => {
  const classes = useStyles();
  const router = useRouter();
  const username = useAppSelector((state) => state.auth.user?.name);
  const dispatch = useAppDispatch();

  const handleClick = (path: string) => () => router.push(path);

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <List component="nav" aria-label="account-menu" className={classes.root}>
      <ListItem button onClick={handleClick('/account')} title={username}>
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
};

export default AccountMenuList;
