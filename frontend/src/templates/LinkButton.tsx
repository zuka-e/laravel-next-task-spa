import { Button, ButtonProps, ButtonTypeMap } from '@mui/material';

import { NextLinkComposed } from 'templates/Link';

type LinkButtonProps = {
  to: string;
} & ButtonProps<
  ButtonTypeMap<Record<string, unknown>, 'a'>['defaultComponent']
>;

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
