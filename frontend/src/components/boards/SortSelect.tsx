import { memo, useCallback } from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

import type { TaskCard, TaskList } from '@/store/api/services/tasks/models';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { setSortByBoard, setSortByList } from '@/store/slices';
// import { type Sort } from '@/utils/sort';

// type Option = Record<string, Sort<TaskCard> & { label: string }>;
// todo: satisfies
const options = {
  'title-asc': {
    label: 'タイトル (昇順)',
    key: 'title',
    direction: 'asc',
  },
  'title-desc': {
    label: 'タイトル (降順)',
    key: 'title',
    direction: 'desc',
  },
  'createdAt-asc': {
    label: '作成日時 (昇順)',
    key: 'createdAt',
    direction: 'asc',
  },
  'createdAt-desc': {
    label: '作成日時 (降順)',
    key: 'createdAt',
    direction: 'desc',
  },
  'updatedAt-asc': {
    label: '更新日時 (昇順)',
    key: 'updatedAt',
    direction: 'asc',
  },
  'updatedAt-desc': {
    label: '更新日時 (降順)',
    key: 'updatedAt',
    direction: 'desc',
  },
  'sequence-asc': {
    label: 'カスタム',
    key: 'sequence',
    direction: 'asc',
  },
} as const;

type SortSelectProps =
  | { boardId?: TaskList['boardId'] }
  | { listId?: TaskCard['listId'] };

const SortSelect = memo(function SortSelect(
  props: SortSelectProps
): JSX.Element {
  const boardId = 'boardId' in props ? props.boardId : undefined;
  const listId = 'listId' in props ? props.listId : undefined;

  const dispatch = useAppDispatch();

  const currentValue = useAppSelector((state) => {
    const sort = boardId
      ? state.taskBoard.data[boardId]?.search.sort
      : listId
      ? state.taskList.data[listId]?.search.sort
      : undefined;

    return sort ?? options['sequence-asc'];
  });

  const handleClick = useCallback(
    (key: keyof typeof options): void => {
      if (boardId) {
        dispatch(setSortByBoard({ id: boardId, sort: options[key] }));
      } else if (listId) {
        dispatch(setSortByList({ id: listId, sort: options[key] }));
      }
    },
    [dispatch, boardId, listId]
  );

  return (
    <List aria-label="sort-select" dense>
      {(Object.keys(options) as unknown as (keyof typeof options)[]).map(
        (key) => (
          <ListItem key={key} button onClick={() => handleClick(key)}>
            <ListItemText primary={options[key].label} />
            {`${currentValue?.key}-${currentValue?.direction}` === key && (
              <ListItemIcon>
                <CheckIcon />
              </ListItemIcon>
            )}
          </ListItem>
        )
      )}
    </List>
  );
});

export default SortSelect;
