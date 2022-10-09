import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { LinearProgress, LinearProgressProps } from '@mui/material';

import { useAppSelector } from 'utils/hooks';

const useStyles = makeStyles((theme: Theme) => ({
  root: { marginTop: theme.spacing(1) },
}));

const Progressbar = (props: LinearProgressProps) => {
  const { root } = useStyles();
  const loading = useAppSelector(
    (state) => state.auth.loading || state.boards.loading
  );

  if (loading)
    return (
      <LinearProgress
        classes={{ root }}
        variant="query"
        color="secondary"
        {...props}
      />
    );
  else return <></>;
};

export default Progressbar;
