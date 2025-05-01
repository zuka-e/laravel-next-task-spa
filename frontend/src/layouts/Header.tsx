import { memo, useCallback, useState, type JSX } from 'react';
import Image from 'next/image';
import {
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { AppBar, Avatar, Drawer, IconButton, Toolbar } from '@mui/material';

import { AccountMenuList } from '@/components/layouts/Header';
import { APP_NAME } from '@/config/app';
import logo from '@/images/logo.svg';
import { useGetSessionQuery } from '@/store/api';
import { Link, LinkButton, PopoverControl } from '@/templates';
import Sidebar from './Sidebar';

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
    [],
  );

  return (
    <AppBar position="sticky">
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
              width="0"
              height="0"
              priority
              className="w-32 h-8"
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
