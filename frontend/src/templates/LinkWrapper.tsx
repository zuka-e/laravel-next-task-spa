import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Link, LinkProps } from '@mui/material';

import { NextLinkComposed } from 'templates/Link';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      color: 'inherit',
      '&:hover': {
        color: 'inherit',
        textDecoration: 'none',
      },
    },
  })
);

type LinkWrapperProps = {
  to: string;
} & LinkProps;

const LinkWrapper = (props: LinkWrapperProps) => {
  const { to, ...linkProps } = props;
  const { root } = useStyles();

  return (
    <Link
      classes={{ root }}
      component={NextLinkComposed}
      to={props.to}
      {...linkProps}
    />
  );
};

export default LinkWrapper;
