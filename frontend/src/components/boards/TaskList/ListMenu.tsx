import { memo, useCallback, useState } from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  Sort as SortIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import { TaskList } from '@/models';
import { useTaskDetails } from '@/lib/hooks';
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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { showTaskDetails } = useTaskDetails();

  const handleClick = useCallback(
    (key: keyof typeof menuItem): void => {
      switch (key) {
        case 'info':
          showTaskDetails('l', list.id);
          break;
        case 'delete':
          setOpenDeleteDialog(true);
          break;
      }
    },
    [list.id, showTaskDetails]
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
        <SortSelect listId={list.id} />
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
