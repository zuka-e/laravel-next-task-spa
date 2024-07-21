import { memo, useCallback, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
  Button,
} from '@mui/material';

import { useDeleteAccountMutation } from '@/store/api';

type DeleteAccountDialogProps = {
  trigger: JSX.Element;
};

const DeleteAccountDialog = memo(function DeleteAccountDialog(
  props: DeleteAccountDialogProps
): JSX.Element {
  const { trigger } = props;
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
  const [open, setOpen] = useState(false);

  const handleClickOpen = useCallback((): void => {
    setOpen(true);
  }, []);

  const handleClose = useCallback((): void => {
    setOpen(false);
  }, []);

  const handleDelete = useCallback((): void => {
    deleteAccount();
  }, [deleteAccount]);

  return (
    <>
      <div onClick={handleClickOpen} className="contents">
        {trigger}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          本当にアカウントを削除しますか？
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            アカウント消滅後は復元することはできません。このアカウントで作成したデータも全て削除されます。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={isLoading}
            onClick={handleClose}
            color="primary"
            autoFocus
          >
            キャンセル
          </Button>
          <Button disabled={isLoading} onClick={handleDelete} color="error">
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default DeleteAccountDialog;
