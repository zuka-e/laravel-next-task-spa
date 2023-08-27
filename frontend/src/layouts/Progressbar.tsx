import { memo } from 'react';

import { LinearProgress, LinearProgressProps } from '@mui/material';

import { useAppSelector } from '@/utils/hooks';

const Progressbar = memo(function Progressbar({
  className,
  ...props
}: LinearProgressProps): JSX.Element {
  const loading = useAppSelector(
    (state) => state.auth.loading || state.boards.loading
  );

  if (loading)
    return (
      <LinearProgress
        variant="query"
        color="secondary"
        {...props}
        className={'mt-2 ' + className ?? ''}
      />
    );
  else return <></>;
});

export default Progressbar;
