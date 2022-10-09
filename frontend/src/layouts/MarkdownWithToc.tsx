import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import { Container, Grid } from '@mui/material';

import { Link, Markdown } from 'templates';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(8),
      [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(6),
      },
      marginBottom: theme.spacing(4),
    },
    toc: {
      position: 'sticky', // スクロールしても位置を固定
      '&': { position: '-webkit-sticky' }, // Safari用
      top: theme.spacing(4), //固定位置
      // `ul`スタイル修正
      marginBlockStart: 0,
      paddingInlineStart: 0,
      listStyle: 'none',
    },
  })
);

type MarkdownWithTocProps = {
  children: Parameters<typeof Markdown>[0]['children'];
  articles: string[];
};

const MarkdownWithToc = (props: MarkdownWithTocProps) => {
  const { children, articles } = props;
  const classes = useStyles();

  return (
    <Container component="main" className={classes.container}>
      <Grid container spacing={4} justifyContent="space-between">
        <Grid item sm={4} xs={12}>
          <ul className={classes.toc}>
            {articles.map((article, id) => (
              <li key={id}>
                <Link href={`#${article}`}>{article}</Link>
              </li>
            ))}
          </ul>
        </Grid>
        <Grid item sm={8} xs={12}>
          <Markdown>{children}</Markdown>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MarkdownWithToc;
