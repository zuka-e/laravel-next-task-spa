import { memo, type JSX } from 'react';
import { LinearProgress, type LinearProgressProps } from '@mui/material';
import clsx from 'clsx';

const Progressbar = memo(function Progressbar({
  className,
  ...props
}: LinearProgressProps): JSX.Element {
  return (
    <LinearProgress
      variant="query"
      color="secondary"
      {...props}
      className={clsx('mt-2', className)}
    />
  );
});

export default Progressbar;
