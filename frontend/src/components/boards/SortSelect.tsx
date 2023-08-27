import { memo, useCallback, useMemo, useState } from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

import { DocumentBase, TaskCard, TaskList } from '@/models';
import { SortOperation } from '@/utils/sort';
import { useAppDispatch } from '@/utils/hooks';
import { sortCard, sortList } from '@/store/slices/taskBoardSlice';

const options = {
  createdAtAsc: '作成日時 (昇順)',
  createdAtDesc: '作成日時 (降順)',
  updatedAtAsc: '更新日時 (昇順)',
  updatedAtDesc: '更新日時 (降順)',
  custom: 'カスタム',
} as const;

type SortOption = keyof typeof options;

type SortSelectProps =
  | { model: 'list'; boardId: TaskList['boardId'] }
  | { model: 'card'; boardId: TaskCard['boardId']; listId: TaskCard['listId'] };

const SortSelect = memo(function SortSelect(
  props: SortSelectProps
): JSX.Element {
  const boardId = props.boardId;
  const listId = props.model === 'card' ? props.listId : undefined;
  const dispatch = useAppDispatch();
  const [currentValue, setCurrentValue] = useState<SortOption>();

  const order = useMemo<Record<SortOption, SortOperation<DocumentBase>>>(() => {
    return {
      createdAtAsc: { column: 'createdAt' },
      createdAtDesc: { column: 'createdAt', direction: 'desc' },
      updatedAtAsc: { column: 'updatedAt' },
      updatedAtDesc: { column: 'updatedAt', direction: 'desc' },
      custom: { column: 'index' },
    };
  }, []);

  const handleClick = useCallback(
    (key: SortOption): void => {
      switch (key) {
        case 'createdAtAsc':
          setCurrentValue('createdAtAsc');
          if (listId)
            dispatch(sortCard({ boardId, listId, ...order.createdAtAsc }));
          else dispatch(sortList({ boardId, ...order.createdAtAsc }));
          break;

        case 'createdAtDesc':
          setCurrentValue('createdAtDesc');
          if (listId)
            dispatch(sortCard({ boardId, listId, ...order.createdAtDesc }));
          else dispatch(sortList({ boardId, ...order.createdAtDesc }));
          break;

        case 'updatedAtAsc':
          setCurrentValue('updatedAtAsc');
          if (listId)
            dispatch(sortCard({ boardId, listId, ...order.updatedAtAsc }));
          else dispatch(sortList({ boardId, ...order.updatedAtAsc }));
          break;

        case 'updatedAtDesc':
          setCurrentValue('updatedAtDesc');
          if (listId)
            dispatch(sortCard({ boardId, listId, ...order.updatedAtDesc }));
          else dispatch(sortList({ boardId, ...order.updatedAtDesc }));
          break;

        case 'custom':
          setCurrentValue('custom');
          if (listId) dispatch(sortCard({ boardId, listId, ...order.custom }));
          else dispatch(sortList({ boardId, ...order.custom }));
          break;
      }
    },
    [
      boardId,
      dispatch,
      listId,
      order.createdAtAsc,
      order.createdAtDesc,
      order.custom,
      order.updatedAtAsc,
      order.updatedAtDesc,
    ]
  );

  return (
    <List aria-label="sort-select" dense>
      {(Object.keys(options) as SortOption[]).map((option) => (
        <ListItem key={option} button onClick={() => handleClick(option)}>
          <ListItemText primary={options[option]} />
          {currentValue === option && (
            <ListItemIcon>
              <CheckIcon />
            </ListItemIcon>
          )}
        </ListItem>
      ))}
    </List>
  );
});

export default SortSelect;
