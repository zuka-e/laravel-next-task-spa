import { useState } from 'react';

import { useDrop } from 'react-dnd';
import { Card, CardActions, Grid, Chip } from '@mui/material';
import type { SelectProps } from '@mui/material';

import * as Model from 'models';
import { draggableItem, DragItem } from 'utils/dnd';
import { useAppDispatch, useAppSelector } from 'utils/hooks';
import { moveCard } from 'store/slices';
import { updateTaskCardRelationships } from 'store/thunks/cards';
import { LabeledSelect } from 'templates';
import { ButtonToAddTask } from '..';
import { TaskCard } from '../TaskCard';
import { ListCardHeader } from '.';

const cardFilter = {
  ALL: 'All',
  TODO: 'Incompleted',
  DONE: 'Completed',
} as const;

type FilterName = typeof cardFilter[keyof typeof cardFilter];

type TaskListProps = {
  list: Model.TaskList;
  listIndex: number;
};

const TaskList = (props: TaskListProps) => {
  const { list, listIndex } = props;
  const selectedId = useAppSelector((state) => state.boards.infoBox.data?.id);
  const dispatch = useAppDispatch();
  const [filterValue, setfilterValue] = useState<FilterName>(cardFilter.ALL);

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

  const isSelected = () => list.id === selectedId;

  const filteredCards = list.cards.filter((card) => {
    if (filterValue === cardFilter.TODO) return !card.done;
    else if (filterValue === cardFilter.DONE) return card.done;
    else return true;
  });

  const handleChange: SelectProps['onChange'] = (event) => {
    setfilterValue(event.target.value as FilterName); // unknown型から変換
  };

  return (
    <Card
      ref={drop}
      elevation={7}
      className={
        'bg-secondary text-white' +
        (isSelected() ? ' bg-secondary-dark outline outline-primary' : '')
      }
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
          {filteredCards.map((card, i) => (
            <TaskCard
              key={card.id}
              card={card}
              cardIndex={i}
              listIndex={listIndex}
            />
          ))}
        </div>
      </div>

      <CardActions>
        <ButtonToAddTask method="POST" model="card" parent={list} transparent />
      </CardActions>
    </Card>
  );
};

export default TaskList;
