import { memo, useCallback, useMemo, useRef, useState, type JSX } from 'react';
import dynamic from 'next/dynamic';
import { type DropIndicatorProps } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { Card, CardActions, Chip, Grid, type SelectProps } from '@mui/material';
import clsx from 'clsx';
import { Virtualizer } from 'virtua';

import { useDroppable, useScrollable, useSortable } from '@/lib/dnd/hooks';
import { useTaskDetails } from '@/lib/hooks';
import { useCreateTaskCardMutation } from '@/store/api';
import type * as Model from '@/store/api/services/tasks/models';
import { LabeledSelect } from '@/templates';
import { AddTaskButton } from '..';
import { TaskCard } from '../TaskCard';
import { ListCardHeader } from '.';

const DropIndicator = dynamic<DropIndicatorProps>(
  () =>
    import('@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box').then(
      (mod) => mod.default,
    ),
  { ssr: false },
);

const cardFilter = {
  ALL: 'All',
  TODO: 'Incomplete',
  DONE: 'Completed',
} as const;

type FilterName = (typeof cardFilter)[keyof typeof cardFilter];

type TaskListProps = {
  list: Pick<Model.TaskList, 'id' | 'title' | 'updatedAt'> & {
    cards: Pick<Model.TaskCard, 'id' | 'listId' | 'title' | 'done'>[];
  };
  index: number;
};

const TaskList = memo(function TaskList(props: TaskListProps): JSX.Element {
  const { list, index } = props;

  const { isTaskSelected } = useTaskDetails();
  const [filterValue, setFilterValue] = useState<FilterName>(cardFilter.ALL);
  const draggableRef = useRef<HTMLDivElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const itemDropzoneRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const [createTaskCard, { isLoading, error }] = useCreateTaskCardMutation();

  const filteredCards = useMemo(() => {
    return (list.cards ?? []).filter((card) => {
      if (filterValue === cardFilter.TODO) return !card.done;
      else if (filterValue === cardFilter.DONE) return card.done;
      else return true;
    });
  }, [filterValue, list]);

  const handleChange = useCallback<NonNullable<SelectProps['onChange']>>(
    (event): void => {
      setFilterValue(event.target.value as FilterName); // unknown型から変換
    },
    [],
  );

  const { isDragging, closestEdge } = useSortable({
    draggableRef,
    dropzoneRef,
    data: {
      type: 'column',
      id: list.id,
      index,
    },
    axis: 'horizontal',
  });

  const { closestEdge: itemClosestEdge } = useDroppable({
    ref: draggableRef,
    data: {
      type: 'column',
      id: list.id,
      index,
    },
    allowedEntities: ['item'],
    dropzoneRef: itemDropzoneRef,
  });

  useScrollable({ scrollableRef });

  return (
    <div ref={itemDropzoneRef} className="h-full">
      <div ref={dropzoneRef} className="relative h-full">
        <Card
          ref={draggableRef}
          elevation={7}
          className={clsx(
            'flex max-h-full flex-col hover:backdrop-opacity-0', // ※ `hover:...` is workaround for drag previews
            isTaskSelected('l', list.id)
              ? 'bg-secondary-dark outline outline-primary'
              : 'bg-secondary',
            isDragging && 'opacity-50',
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

          {itemClosestEdge === 'top' && (
            <div className="relative mx-2">
              <DropIndicator edge={itemClosestEdge} gap="0.25rem" />
            </div>
          )}
          <div
            ref={scrollableRef}
            className="overflow-x-hidden overflow-y-auto"
          >
            <Virtualizer>
              {filteredCards.map((card, i) => (
                <TaskCard key={card.id} card={card} index={i} />
              ))}
            </Virtualizer>
          </div>
          {itemClosestEdge === 'bottom' && (
            <div className="relative mx-2">
              <DropIndicator edge={itemClosestEdge} gap="0.25rem" />
            </div>
          )}

          <CardActions>
            <AddTaskButton
              disabled={isLoading}
              error={error}
              onSubmit={(data) => createTaskCard({ listId: list.id, ...data })}
            />
          </CardActions>
        </Card>
        {closestEdge && <DropIndicator edge={closestEdge} gap="1rem" />}
      </div>
    </div>
  );
});

export default TaskList;
