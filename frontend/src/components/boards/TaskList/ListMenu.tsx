import { memo, useCallback, useState } from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  Sort as SortIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import { TaskList } from '@/models';
import { useAppDispatch } from '@/utils/hooks';
import { openInfoBox } from '@/store/slices/taskBoardSlice';
import { DeleteTaskDialog, PopoverControl } from '@/templates';
import { SortSelect } from '..';

const menuItem = {
  sort: '並び替え',
  info: '詳細を表示',
  delete: '削除',
} as const;

type ListMenuProps = {
  list: TaskList;
};

const ListMenu = memo(function ListMenu(props: ListMenuProps): JSX.Element {
  const { list } = props;
  const dispatch = useAppDispatch();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleClick = useCallback(
    (key: keyof typeof menuItem): void => {
      switch (key) {
        case 'info':
          dispatch(openInfoBox({ model: 'list', data: list }));
          break;
        case 'delete':
          setOpenDeleteDialog(true);
          break;
      }
    },
    [dispatch, list]
  );

  const handleCloseDeleteDialog = useCallback((): void => {
    setOpenDeleteDialog(false);
  }, []);

  return (
    <List component="nav" aria-label="list-menu" dense>
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
        <SortSelect model="card" boardId={list.boardId} listId={list.id} />
      </PopoverControl>
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
      <DeleteTaskDialog
        model="list"
        data={props.list}
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      />
      <ListItem
        button
        onClick={() => handleClick('delete')}
        title={menuItem.delete}
      >
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText primary={menuItem.delete} />
      </ListItem>
    </List>
  );
});

export default ListMenu;
