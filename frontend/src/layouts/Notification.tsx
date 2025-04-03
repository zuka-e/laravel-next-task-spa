// cf. https://mui.com/material-ui/react-snackbar/#consecutive-snackbars

import { memo, useCallback, useEffect, useState, type JSX } from 'react';

import { Snackbar, Alert } from '@mui/material';

import { removeNotification } from '@/store/slices';
import { useAppDispatch, useDeepEqualSelector } from '@/utils/hooks';

const Notification = memo(function Notification(): JSX.Element {
  const messages = useDeepEqualSelector((state) => state.app.messages);
  const [open, setOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<
    typeof messages[0] | undefined
  >();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const newNotification = messages.at(-1);

    if (newNotification && !currentNotification) {
      // Set a new snack when we don't have an active one
      setCurrentNotification({ ...newNotification });
      dispatch(removeNotification());
      setOpen(true);
    } else if (newNotification && currentNotification && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [messages, currentNotification, open, dispatch]);

  const handleClose = useCallback(
    (_event?: React.SyntheticEvent | Event, reason?: string): void => {
      if (reason === 'clickaway') return;
      else setOpen(false);
    },
    []
  );

  const handleExited = useCallback((): void => {
    setCurrentNotification(undefined);
  }, []);

  if (!currentNotification?.message) {
    return <></>;
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      TransitionProps={{ onExited: handleExited }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      aria-label="messages"
    >
      <Alert
        onClose={handleClose}
        severity={currentNotification.severity || 'info'}
        elevation={12}
        className="whitespace-pre-line"
      >
        {currentNotification?.message}
      </Alert>
    </Snackbar>
  );
});

export default Notification;
