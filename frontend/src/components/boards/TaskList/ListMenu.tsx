import { memo, useCallback, useState } from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  Sort as SortIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import { TaskList } from '@/models';
import { DeleteTaskDialog, PopoverControl } from '@/templates';
import { showTaskListDetails } from '@/components/boards/InfoBox/InfoBox';
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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleClick = useCallback(
    (key: keyof typeof menuItem): void => {
      switch (key) {
        case 'info':
          showTaskListDetails(list.id);
          break;
        case 'delete':
          setOpenDeleteDialog(true);
          break;
      }
    },
    [list.id]
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
