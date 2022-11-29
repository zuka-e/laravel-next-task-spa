import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
  Button,
} from '@mui/material';

import { DeleteAction } from 'store/slices';
import { useAppDispatch } from 'utils/hooks';
import { destroyTaskBoard } from 'store/thunks/boards';
import { destroyTaskList } from 'store/thunks/lists';
import { destroyTaskCard } from 'store/thunks/cards';

type DeleteTaskDialogProps = DeleteAction & {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteTaskDialog = (props: DeleteTaskDialogProps) => {
  const dispatch = useAppDispatch();

  const renderTitle = () => {
    switch (props.model) {
      case 'board':
        return `本当にボード ${props.data.title} を削除しますか？`;
      case 'list':
        return `本当にリスト ${props.data.title} を削除しますか？`;
      case 'card':
        return `本当にカード ${props.data.title} を削除しますか？`;
    }
  };

  const renderContent = () => {
    switch (props.model) {
      case 'board':
        return `ボード消滅後は復元することはできません。
                このボードで作成したデータは、リスト及びカードも含め全て削除されます。`;
      case 'list':
        return `リスト消滅後は復元することはできません。
                このリストで作成したデータはカードも含めて全て削除されます。`;
      case 'card':
        return `カード消滅後は復元することはできません。
                このカードに含まれるデータも全て削除されます。`;
    }
  };

  const handleClose = () => props.setOpen(false);

  const handleDelete = async () => {
    switch (props.model) {
      case 'board':
        return await dispatch(destroyTaskBoard(props.data));
      case 'list':
        return await dispatch(destroyTaskList(props.data));
      case 'card':
        return await dispatch(destroyTaskCard(props.data));
    }
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{renderTitle()}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {renderContent()}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          キャンセル
        </Button>
        <Button onClick={handleDelete} color="error">
          削除
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTaskDialog;
