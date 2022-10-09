import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Button, ButtonProps, ButtonTypeMap } from '@mui/material';

import { NextLinkComposed } from 'templates/Link';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contained: {
      textDecoration: 'none',
      '&:hover': { textDecoration: 'none' },
    },
    containedPrimary: {
      '&:hover': { color: theme.palette.primary.contrastText },
    },
    containedSecondary: {
      '&:hover': { color: theme.palette.secondary.contrastText },
    },
  })
);

type LinkButtonProps = {
  to: string;
} & ButtonProps<
  ButtonTypeMap<Record<string, unknown>, 'a'>['defaultComponent']
>;

const LinkButton = (props: LinkButtonProps) => {
  const { to, classes, ...buttonProps } = props;
  const defaultClasses = useStyles();

  return (
    <Button
      classes={{ ...defaultClasses, ...classes }}
      variant="contained"
      color="primary"
      component={NextLinkComposed}
      to={to}
      {...buttonProps}
    />
  );
};

export default LinkButton;
