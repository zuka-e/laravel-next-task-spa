import { memo } from 'react';

import MarkdownToJsx, { MarkdownToJSX } from 'markdown-to-jsx';
import { Typography } from '@mui/material';

const options: MarkdownToJSX.Options = {
  slugify: (str) => str, // 自動生成されるid属性を日本語で利用
  overrides: {
    h1: {
      component: (props) => (
        <Typography gutterBottom component="h1" variant="h3" {...props} />
      ),
    },
    h2: {
      component: (props) => (
        <Typography gutterBottom component="h2" variant="h4" {...props} />
      ),
    },
    h3: {
      component: (props) => (
        <Typography gutterBottom component="h3" variant="h5" {...props} />
      ),
    },
    h4: {
      component: (props) => (
        <Typography gutterBottom component="h4" variant="h6" {...props} />
      ),
    },
    p: { component: (props) => <Typography paragraph {...props} /> },
    ol: { props: { style: { paddingInlineStart: '1.6rem' } } },
    li: {
      component: (props) => <Typography component="li" {...props} />,
    },
  },
};

const Markdown = memo(function Markdown({
  children,
}: Parameters<typeof MarkdownToJsx>[0]): JSX.Element {
  return <MarkdownToJsx options={options}>{children}</MarkdownToJsx>;
});

export default Markdown;
