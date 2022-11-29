import { Grid, Typography } from '@mui/material';

import { APP_NAME } from 'config/app';
import { Link } from 'templates';

const Copyright = () => (
  <Typography variant="body2" className="text-inherit">
    © {APP_NAME} {new Date().getFullYear()}
  </Typography>
);

const Footer = () => {
  return (
    <footer className="mt-auto bg-black py-8 text-white">
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Link href="/terms" className="text-inherit">
            Terms
          </Link>
          <span className="ml-2 border-0 border-l border-solid pl-2" />
          <Link href="/privacy" className="text-inherit">
            Privacy
          </Link>
        </Grid>
        <Grid item>
          <Copyright />
        </Grid>
      </Grid>
    </footer>
  );
};

export default Footer;
