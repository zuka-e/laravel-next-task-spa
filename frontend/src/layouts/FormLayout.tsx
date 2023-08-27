import { memo } from 'react';

import { Container, Card, Grid, Avatar, Typography } from '@mui/material';

import { APP_NAME } from '@/config/app';
import { AlertMessage } from '@/templates';
import Link, { NextLinkComposed } from '@/templates/Link';
import logo from '@/images/logo_short.svg';

const Copyright = memo(function Copyright(): JSX.Element {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      © {APP_NAME} {new Date().getFullYear()}
    </Typography>
  );
});

type FormLayoutProps = {
  children: React.ReactNode;
  title: string;
  message?: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
};

const FormLayout = memo(function FormLayout(
  props: FormLayoutProps
): JSX.Element {
  const { children, title, onSubmit, message } = props;

  return (
    <>
      <Container component="main" maxWidth="xs" className="my-4 sm:my-16">
        {message && (
          <AlertMessage
            severity="error"
            body={message}
            className="mb-4 whitespace-pre-wrap text-xs"
          />
        )}
        <Card elevation={2} className="p-6">
          <Grid container className="flex-col items-center">
            <Avatar
              component={NextLinkComposed}
              to="/"
              src={logo.src}
              alt={APP_NAME}
              title={APP_NAME}
              className="my-2 h-20 w-20"
            />
            <Typography component="h1" variant="h5" gutterBottom>
              {title}
            </Typography>
            <form onSubmit={onSubmit} className="w-full">
              {children}
            </form>
          </Grid>
        </Card>
      </Container>
      <footer>
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <Link href="/terms" target="_blank" rel="noopener noreferrer">
              {'Terms'}
            </Link>
            <span className="ml-2 border-0 border-l border-solid pl-2" />
            <Link href="/privacy" target="_blank" rel="noopener noreferrer">
              {'Privacy'}
            </Link>
          </Grid>
          <Grid item>
            <Copyright />
          </Grid>
        </Grid>
      </footer>
    </>
  );
});

export default FormLayout;
