import { useRouter } from 'next/router';

import { Container, Typography, Button } from '@mui/material';

import { BaseLayout } from '@/layouts';

type HttpErrorLayoutProps = {
  title: string;
  description: string;
  hint?: string;
  children?: React.ReactNode;
};

const HttpErrorLayout = (props: HttpErrorLayoutProps) => {
  const { title, description, hint, children } = props;
  const router = useRouter();

  const handleClick = () => {
    router.push(router.asPath === '/' ? '#' : '/');
  };

  return (
    <BaseLayout>
      <Container component="main" maxWidth="md" className="my-14">
        <Typography variant="h1" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h2" gutterBottom color="textSecondary">
          {description}
        </Typography>
        {hint && (
          <Typography color="textSecondary" paragraph>
            {hint}
          </Typography>
        )}
        {children}
        <Button variant="contained" color="primary" onClick={handleClick}>
          トップページへ戻る
        </Button>
      </Container>
    </BaseLayout>
  );
};

export default HttpErrorLayout;
