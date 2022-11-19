import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
  Button,
} from '@mui/material';

import { deleteAccount } from 'store/thunks/auth';
import { useAppDispatch } from 'utils/hooks';
import { AlertButton } from 'templates';

type DeleteAccountDialogProps = {
  trigger: JSX.Element;
};

const DeleteAccountDialog = (props: DeleteAccountDialogProps) => {
  const { trigger } = props;
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleDelete = () => {
    dispatch(deleteAccount());
  };

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
          <Button onClick={handleClose} color="primary" autoFocus>
            キャンセル
          </Button>
          <AlertButton onClick={handleDelete} color="danger">
            削除
          </AlertButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteAccountDialog;
