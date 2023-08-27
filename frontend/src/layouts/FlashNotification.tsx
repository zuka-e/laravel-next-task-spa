// cf. https://mui.com/material-ui/react-snackbar/#consecutive-snackbars

import { memo, useCallback, useEffect, useState } from 'react';

import { Snackbar, Alert } from '@mui/material';

import { shiftFlash } from '@/store/slices';
import { useAppDispatch, useDeepEqualSelector } from '@/utils/hooks';

const FlashNotification = memo(function FlashNotification(): JSX.Element {
  const flashes = useDeepEqualSelector((state) => state.auth.flashes);
  const [open, setOpen] = useState(false);
  const [currentFlash, setCurrentFlash] = useState<
    typeof flashes[0] | undefined
  >();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const newFlash = flashes.at(-1);

    if (newFlash && !currentFlash) {
      // Set a new snack when we don't have an active one
      setCurrentFlash({ ...newFlash });
      dispatch(shiftFlash());
      setOpen(true);
    } else if (newFlash && currentFlash && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [flashes, currentFlash, open, dispatch]);

  const handleClose = useCallback(
    (_event?: React.SyntheticEvent | Event, reason?: string): void => {
      if (reason === 'clickaway') return;
      else setOpen(false);
    },
    []
  );

  const handleExited = useCallback((): void => {
    setCurrentFlash(undefined);
  }, []);

  if (!currentFlash?.message) {
    return <></>;
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      TransitionProps={{ onExited: handleExited }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      aria-label="flashes"
    >
      <Alert
        onClose={handleClose}
        severity={currentFlash.severity || 'info'}
        elevation={12}
        className="whitespace-pre-line"
      >
        {currentFlash.message}
      </Alert>
    </Snackbar>
  );
});

export default FlashNotification;
