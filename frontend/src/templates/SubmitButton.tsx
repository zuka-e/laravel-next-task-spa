import { memo, type JSX } from 'react';
import { Button, type ButtonProps } from '@mui/material';

const SubmitButton = memo(function SubmitButton(
  props: ButtonProps,
): JSX.Element {
  return (
    <Button type="submit" variant="contained" color="primary" {...props} />
  );
});

export default SubmitButton;
