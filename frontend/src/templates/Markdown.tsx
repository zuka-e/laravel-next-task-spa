import { memo, type JSX } from 'react';
import { Typography } from '@mui/material';
import MarkdownToJsx, { type MarkdownProps } from 'markdown-to-jsx';

const OPTIONS = {
  slugify: (str) => str, // 自動生成されるid属性を日本語で利用
  overrides: {
    h1: {
      component: Typography,
      props: { gutterBottom: true, component: 'h1', variant: 'h3' },
    },
    h2: {
      component: Typography,
      props: { gutterBottom: true, component: 'h2', variant: 'h4' },
    },
    h3: {
      component: Typography,
      props: { gutterBottom: true, component: 'h3', variant: 'h5' },
    },
    h4: {
      component: Typography,
      props: { gutterBottom: true, component: 'h4', variant: 'h6' },
    },
    p: { component: Typography, props: { paragraph: true } },
    ol: { props: { style: { paddingInlineStart: '1.6rem' } } },
    li: { component: Typography, props: { component: 'li' } },
  },
} as const satisfies MarkdownProps['options'];

const Markdown = memo(function Markdown({
  children,
  options,
}: MarkdownProps): JSX.Element {
  return (
    <MarkdownToJsx options={{ ...OPTIONS, ...options }}>
      {children}
    </MarkdownToJsx>
  );
});

export default Markdown;
