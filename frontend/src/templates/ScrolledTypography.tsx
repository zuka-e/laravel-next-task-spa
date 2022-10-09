import makeStyles from '@mui/styles/makeStyles';
import { Typography, TypographyProps } from '@mui/material';

const useStyles = makeStyles({
  root: {
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    '&:hover': { overflowX: 'auto' },
    '&::-webkit-scrollbar': { height: '0px' },
  },
});

const ScrolledTypography = (props: TypographyProps) => {
  const { classes, ...typographyProps } = props;
  const styles = useStyles();
  const root = classes?.root ? `${styles.root} ${classes.root}` : styles.root;

  return <Typography classes={{ ...classes, root }} {...typographyProps} />;
};

export default ScrolledTypography;
