import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';

import { NextLinkComposed } from 'templates/Link';

type LinkButtonProps = ButtonProps<'a'> &
  Parameters<typeof NextLinkComposed>[number];

const LinkButton = (props: LinkButtonProps) => {
  return (
    <Button
      component={NextLinkComposed}
      variant="contained"
      color="primary"
      {...props}
    />
  );
};

export default LinkButton;
