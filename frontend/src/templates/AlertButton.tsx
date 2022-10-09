import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import { Button, ButtonProps } from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contained_success: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.success.main,
      '&:hover': {
        backgroundColor: theme.palette.success.dark,
      },
    },
    contained_info: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.info.light,
      '&:hover': {
        backgroundColor: theme.palette.info.main,
      },
    },
    contained_warning: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.warning.main,
      '&:hover': {
        backgroundColor: theme.palette.warning.dark,
      },
    },
    contained_danger: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.error.main,
      '&:hover': {
        backgroundColor: theme.palette.error.dark,
      },
    },
    text_success: { color: theme.palette.success.main },
    text_info: { color: theme.palette.info.main },
    text_warning: { color: theme.palette.warning.main },
    text_danger: { color: theme.palette.error.main },
  })
);

type Color = 'success' | 'info' | 'warning' | 'danger';

type AlertButtonProps = {
  color: Color;
  variant?: 'contained' | 'text';
} & Omit<ButtonProps, 'color'>;

const AlertButton = (props: AlertButtonProps) => {
  const { color, variant, className, ...buttonProps } = props;
  const classes = useStyles();
  const classKey = `${variant || 'contained'}_${color}` as const;

  return (
    <Button
      className={
        className ? `${className} ${classes[classKey]}` : classes[classKey]
      }
      variant={variant || 'contained'}
      {...buttonProps}
    />
  );
};

export default AlertButton;
