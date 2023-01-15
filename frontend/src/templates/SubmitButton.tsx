import { Button, ButtonProps } from '@mui/material';

import { useAppSelector } from '@/utils/hooks';

const SubmitButton = (props: ButtonProps) => {
  const loading = useAppSelector((state) => state.auth.loading);

  return (
    <Button
      disabled={loading}
      type="submit"
      variant="contained"
      color="primary"
      {...props}
    />
  );
};

export default SubmitButton;
