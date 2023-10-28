import { memo, useCallback, useState } from 'react';
import Image from 'next/image';

import { AppBar, Toolbar, Drawer, Avatar, IconButton } from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

import { APP_NAME } from '@/config/app';
import { useGetSessionQuery } from '@/store/api';
import { Link, LinkButton, PopoverControl } from '@/templates';
import { AccountMenuList } from '@/components/layouts/Header';
import Sidebar from './Sidebar';
import logo from '@/images/logo.svg';

const Header = memo(function Header(): JSX.Element {
  const { auth } = useGetSessionQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      auth: !!result.data?.user?.id,
    }),
  });
  const [open, setOpen] = useState(false);

  const toggleDrawer = useCallback(
    (open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent): void => {
        if (
          event?.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        setOpen(open);
      },
    []
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          aria-controls="menu"
          aria-haspopup="true"
          onClick={toggleDrawer(true)}
          size="large"
        >
          <MenuIcon />
        </IconButton>
        <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
          <Sidebar toggleDrawer={toggleDrawer} />
        </Drawer>
        <div className="ml-4 flex-auto">
          <Link href={'/'}>
            <Image
              src={logo.src}
              alt={APP_NAME}
              width="120"
              height="30"
              priority
            />
          </Link>
        </div>
        {auth ? <AccountMenuButton /> : <SignInLinkButton />}
      </Toolbar>
    </AppBar>
  );
});

const SignInLinkButton = memo(function SignInLinkButton(): JSX.Element {
  return (
    <LinkButton to="/login" color="secondary" startIcon={<AccountCircleIcon />}>
      {'ログイン'}
    </LinkButton>
  );
});

const AccountMenuButton = memo(function AccountMenuButton(): JSX.Element {
  return (
    <PopoverControl
      trigger={
        <IconButton aria-label="account-menu" size="large">
          <Avatar alt="avatar" src={undefined} className="bg-secondary">
            <PersonIcon />
          </Avatar>
        </IconButton>
      }
    >
      <div className="flex-auto">
        <AccountMenuList />
      </div>
    </PopoverControl>
  );
});

export default Header;
