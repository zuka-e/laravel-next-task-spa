import { memo, useMemo } from 'react';

import { Alert, AlertTitle } from '@mui/material';
import type { AlertProps, AlertColor } from '@mui/material';

const headerMap: Record<AlertColor, Capitalize<AlertColor>> = {
  success: 'Success',
  info: 'Info',
  warning: 'Warning',
  error: 'Error',
};

type AlertMessageProps = {
  severity: AlertColor;
  header?: string;
  body?: string;
  children?: React.ReactNode;
} & AlertProps;

const AlertMessage = memo(function AlertMessage(
  props: AlertMessageProps
): JSX.Element {
  const { header, body, ...alertProps } = props;

  const title = useMemo(
    (): string => props.header || headerMap[props.severity],
    [props.header, props.severity]
  );

  return (
    <Alert elevation={2} {...alertProps}>
      <AlertTitle title={title}>{title}</AlertTitle>
      {props.body || props.children}
    </Alert>
  );
});

export default AlertMessage;
