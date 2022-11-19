import { Backdrop, CircularProgress } from '@mui/material';

type LoadingProps = { open?: boolean };

const Loading = (props: LoadingProps) => {
  return (
    <Backdrop open={!!props.open} className="z-50 text-white">
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
