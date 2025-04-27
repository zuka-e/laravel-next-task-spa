import { memo, useCallback, type JSX } from 'react';
import { Check as CheckIcon } from '@mui/icons-material';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import type { TaskCard, TaskList } from '@/store/api/services/tasks/models';
import { setSortByBoard, setSortByList } from '@/store/slices';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import type { Sort } from '@/utils/sort';

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
} as const satisfies Record<`${string}-${string}`, Sort & { label: string }>;

type SortSelectProps =
  | { boardId?: TaskList['boardId'] }
  | { listId?: TaskCard['listId'] };

const SortSelect = memo(function SortSelect(
  props: SortSelectProps,
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

    return sort;
  });

  const handleClick = useCallback(
    (key: keyof typeof options): void => {
      if (boardId) {
        dispatch(setSortByBoard({ id: boardId, sort: options[key] }));
      } else if (listId) {
        dispatch(setSortByList({ id: listId, sort: options[key] }));
      }
    },
    [dispatch, boardId, listId],
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
        ),
      )}
    </List>
  );
});

export default SortSelect;
