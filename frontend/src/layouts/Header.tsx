import { useState } from 'react';
import Image from 'next/image';

import { AppBar, Toolbar, Drawer, Avatar, IconButton } from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

import { APP_NAME } from 'config/app';
import { isSignedIn } from 'utils/auth';
import { Link, LinkButton, PopoverControl } from 'templates';
import { AccountMenuList } from 'components/layouts/Header';
import Sidebar from './Sidebar';
import logo from 'images/logo.svg';

const Header = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event?.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      )
        return;
      setOpen(open);
    };

  const SignInLinkButton = () => (
    <LinkButton to="/login" color="secondary" startIcon={<AccountCircleIcon />}>
      {'ログイン'}
    </LinkButton>
  );

  const AccountMenuButton = () => (
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
        {isSignedIn() ? <AccountMenuButton /> : <SignInLinkButton />}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
