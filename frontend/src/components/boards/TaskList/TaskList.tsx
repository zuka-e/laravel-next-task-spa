import { memo, useCallback, useMemo, useState } from 'react';

import clsx from 'clsx';
import { useDrop } from 'react-dnd';
import {
  Card,
  CardActions,
  Grid,
  Chip,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import type { SelectProps } from '@mui/material';

import * as Model from '@/models';
import { repeatMap } from '@/utils';
import { draggableItem, DragItem } from '@/utils/dnd';
import { useAppDispatch, useIntersectionObserver } from '@/utils/hooks';
import { useTaskDetails } from '@/lib/hooks';
import { moveCard } from '@/store/slices';
import { updateTaskCardRelationships } from '@/store/thunks/cards';
import { useGetTaskCardsQuery } from '@/store/api';
import { LabeledSelect } from '@/templates';
import { AddTaskButton } from '..';
import { TaskCard } from '../TaskCard';
import { ListCardHeader } from '.';

const cardFilter = {
  ALL: 'All',
  TODO: 'Incomplete',
  DONE: 'Completed',
} as const;

type FilterName = typeof cardFilter[keyof typeof cardFilter];

type TaskListProps = {
  list: Model.TaskList;
  listIndex: number;
};

const TaskList = memo(function TaskList(props: TaskListProps): JSX.Element {
  const { list, listIndex } = props;
  const [page, setPage] = useState(1);
  const { data: paginatedCard, isLoading: isLoadingCard } =
    useGetTaskCardsQuery({ listId: list.id, page, limit: 20 });
  const { isTaskSelected } = useTaskDetails();
  const dispatch = useAppDispatch();
  const [filterValue, setFilterValue] = useState<FilterName>(cardFilter.ALL);

  const nextCardRef = useIntersectionObserver(() => {
    setPage((paginatedCard?.meta.current_page || 0) + 1);
  });

  /** リスト間のカードの移動を司る */
  const [, drop] = useDrop({
    accept: draggableItem.card,
    hover: (item: DragItem) => {
      const dragListIndex = item.listIndex;
      const hoverListIndex = listIndex;
      const dragIndex = item.index;
      const hoverIndex = 0;

      // 位置不変の場合
      if (dragListIndex === hoverListIndex) return;

      const boardId = list.boardId;
      dispatch(
        moveCard({
          dragListIndex,
          hoverListIndex,
          dragIndex,
          hoverIndex,
          boardId,
          listId: list.id,
        })
      );

      item.index = hoverIndex;
      item.listIndex = hoverListIndex;
    },
    drop: (item: DragItem) => {
      /**リスト間移動が行われた場合 */
      if (item.listId !== list.id) {
        dispatch(
          updateTaskCardRelationships({
            data: { id: item.id, listId: item.listId },
            body: { listId: list.id },
          })
        );
      }
    },
  });

  const filteredCards = useMemo((): Model.TaskCard[] => {
    return (paginatedCard?.data ?? []).filter((card) => {
      if (filterValue === cardFilter.TODO) return !card.done;
      else if (filterValue === cardFilter.DONE) return card.done;
      else return true;
    });
  }, [filterValue, paginatedCard?.data]);

  const handleChange = useCallback<NonNullable<SelectProps['onChange']>>(
    (event): void => {
      setFilterValue(event.target.value as FilterName); // unknown型から変換
    },
    []
  );

  return (
    <Card
      ref={drop}
      elevation={7}
      className={clsx(
        'text-white',
        isTaskSelected('l', list.id)
          ? 'bg-secondary-dark outline outline-primary'
          : 'bg-secondary'
      )}
    >
      <ListCardHeader list={list} />

      <CardActions>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <LabeledSelect
              label="Filter"
              options={cardFilter}
              value={filterValue}
              color="error"
              onChange={handleChange}
            />
          </Grid>
          <Grid item>
            <Chip label={filteredCards.length} title="タスク数" />
          </Grid>
        </Grid>
      </CardActions>

      <div className="max-h-[90vh] overflow-y-auto p-2">
        <div className="flex flex-col gap-2">
          {isLoadingCard
            ? repeatMap(3, (i) => (
                <Skeleton key={i} variant="rectangular" height={40} />
              ))
            : filteredCards.map((card, i) => (
                <TaskCard
                  key={card.id}
                  card={card}
                  cardIndex={i}
                  listIndex={listIndex}
                />
              ))}
          {paginatedCard?.links.next && (
            <div className="my-2 text-center">
              <CircularProgress ref={nextCardRef} />
            </div>
          )}
        </div>
      </div>

      <CardActions>
        <AddTaskButton method="POST" model="card" parent={list} transparent />
      </CardActions>
    </Card>
  );
});

export default TaskList;
