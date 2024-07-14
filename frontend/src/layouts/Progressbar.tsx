import { memo } from 'react';

import { LinearProgress, LinearProgressProps } from '@mui/material';

const Progressbar = memo(function Progressbar({
  className,
  ...props
}: LinearProgressProps): JSX.Element {
  return (
    <LinearProgress
      variant="query"
      color="secondary"
      {...props}
      className={'mt-2 ' + className ?? ''}
    />
  );
});

export default Progressbar;
