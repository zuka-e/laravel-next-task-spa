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

const AlertMessage = (props: AlertMessageProps) => {
  const { header, body, ...alertProps } = props;
  const title = props.header || headerMap[props.severity];

  return (
    <Alert elevation={2} {...alertProps}>
      <AlertTitle title={title}>{title}</AlertTitle>
      {props.body || props.children}
    </Alert>
  );
};

export default AlertMessage;
