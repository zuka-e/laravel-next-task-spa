import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import { Backdrop, CircularProgress } from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  })
);

type LoadingProps = { open?: boolean };

const Loading = (props: LoadingProps) => {
  const classes = useStyles();
  return (
    <Backdrop className={classes.backdrop} open={!!props.open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
