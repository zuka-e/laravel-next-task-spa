import { memo, useCallback, useState } from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  Sort as SortIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import { TaskBoard } from '@/models';
import { useAppDispatch, useRoute } from '@/utils/hooks';
import { openInfoBox } from '@/store/slices/taskBoardSlice';
import { PopoverControl, DeleteTaskDialog } from '@/templates';
import { SortSelect } from '..';

const menuItem = {
  sort: '並び替え',
  info: '詳細を表示',
  delete: '削除',
} as const;

type BoardMenuProps = {
  board: TaskBoard;
};

const BoardMenu = memo(function BoardMenu(props: BoardMenuProps): JSX.Element {
  const { board } = props;
  const { pathParams } = useRoute();
  const dispatch = useAppDispatch();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleClick = useCallback(
    (key: keyof typeof menuItem): void => {
      switch (key) {
        case 'info':
          dispatch(openInfoBox({ model: 'board', data: board }));
          break;
        case 'delete':
          setOpenDeleteDialog(true);
          break;
      }
    },
    [board, dispatch]
  );

  const handleCloseDeleteDialog = useCallback((): void => {
    setOpenDeleteDialog(false);
  }, []);

  return (
    <List component="nav" aria-label="board-menu" dense>
      {pathParams?.boardId && ( // 詳細ページの場合
        <PopoverControl
          position="left"
          trigger={
            <ListItem button title={menuItem.sort}>
              <ListItemIcon>
                <SortIcon />
              </ListItemIcon>
              <ListItemText primary={menuItem.sort + '...'} />
            </ListItem>
          }
        >
          <SortSelect model="list" boardId={board.id} />
        </PopoverControl>
      )}
      {pathParams?.boardId && (
        <ListItem
          button
          onClick={() => handleClick('info')}
          title={menuItem.info}
        >
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary={menuItem.info} />
        </ListItem>
      )}
      <DeleteTaskDialog
        model="board"
        data={board}
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      />
      <ListItem button onClick={() => handleClick('delete')}>
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText title={menuItem.delete} primary={menuItem.delete} />
      </ListItem>
    </List>
  );
});

export default BoardMenu;
