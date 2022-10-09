import makeStyles from '@mui/styles/makeStyles';
import { Grid, GridProps } from '@mui/material';

const useStyles = makeStyles({
  root: {
    overflow: 'auto',
    '&::-webkit-scrollbar': { width: '8px', height: '8px' },
    '&::-webkit-scrollbar-track': { backgroundColor: '#eee' },
    '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc' },
  },
});

const ScrolledGridContainer = (props: GridProps) => {
  const { classes, ...gridProps } = props;
  const styles = useStyles();
  const root = classes?.root ? `${styles.root} ${classes.root}` : styles.root;

  return (
    <Grid
      container
      wrap="nowrap"
      classes={{ ...classes, root }}
      {...gridProps}
    />
  );
};

export default ScrolledGridContainer;
