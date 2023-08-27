import { memo } from 'react';

import { Backdrop, CircularProgress } from '@mui/material';

type LoadingProps = { open?: boolean };

const Loading = memo(function Loading(props: LoadingProps): JSX.Element {
  return (
    <Backdrop open={!!props.open} className="z-50 text-white">
      <CircularProgress color="inherit" />
    </Backdrop>
  );
});

export default Loading;
