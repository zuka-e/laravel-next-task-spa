import { memo } from 'react';

import { Container, Grid } from '@mui/material';

import { Link, Markdown } from '@/templates';

type MarkdownWithTocProps = {
  children: Parameters<typeof Markdown>[0]['children'];
  articles: string[];
};

const MarkdownWithToc = memo(function MarkdownWithToc(
  props: MarkdownWithTocProps
): JSX.Element {
  const { children, articles } = props;

  return (
    <Container component="main" className="my-8 list-none md:my-16">
      <Grid container spacing={4} justifyContent="space-between">
        <Grid item md={4} xs={12}>
          <ul className="sticky top-8 list-none [margin-block-start:0] [padding-inline-start:0]">
            {articles.map((article, id) => (
              <li key={id}>
                <Link href={`#${article}`}>{article}</Link>
              </li>
            ))}
          </ul>
        </Grid>
        <Grid item md={8} xs={12}>
          <Markdown>{children}</Markdown>
        </Grid>
      </Grid>
    </Container>
  );
});

export default MarkdownWithToc;
