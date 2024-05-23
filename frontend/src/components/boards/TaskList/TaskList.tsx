import { memo, useCallback, useMemo, useState } from 'react';

import clsx from 'clsx';
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
import { useIntersectionObserver } from '@/utils/hooks';
import { useTaskDetails } from '@/lib/hooks';
import { useCreateTaskCardMutation, useGetTaskCardsQuery } from '@/store/api';
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
  const [filterValue, setFilterValue] = useState<FilterName>(cardFilter.ALL);

  const nextCardRef = useIntersectionObserver(() => {
    setPage((paginatedCard?.meta.current_page || 0) + 1);
  });

  const [createTaskCard, { isLoading, error }] = useCreateTaskCardMutation();

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
        <AddTaskButton
          disabled={isLoading}
          error={error}
          onSubmit={(data) => createTaskCard({ listId: list.id, ...data })}
        />
      </CardActions>
    </Card>
  );
});

export default TaskList;
