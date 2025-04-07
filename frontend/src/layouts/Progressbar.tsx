import { memo, type JSX } from 'react';

import clsx from 'clsx';
import { LinearProgress, type LinearProgressProps } from '@mui/material';

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
