import { memo, useCallback, useRef } from 'react';

import clsx from 'clsx';
import { useDrag, useDrop } from 'react-dnd';
import { Card, Typography } from '@mui/material';

import * as Model from '@/models';
import { useMoveCard } from '@/store/api';
import { draggableItem, DragItem } from '@/utils/dnd';
import { useTaskDetails } from '@/lib/hooks';

type TaskCardProps = {
  card: Model.TaskCard;
  cardIndex: number;
  listIndex: number;
};

const TaskCard = memo(function TaskCard(props: TaskCardProps): JSX.Element {
  const { card, cardIndex, listIndex } = props;
  const { showTaskDetails, isTaskSelected } = useTaskDetails();
  const { moveCard } = useMoveCard();
  const ref = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag<DragItem, unknown, unknown>({
    type: draggableItem.card,
    item: {
      ...card,
      index: cardIndex,
      listIndex: listIndex,
    },
  });

  const [{ isOver }, drop] = useDrop({
    accept: draggableItem.card,
    hover: (item: DragItem) => {
      if (item.id === card.id) {
        return;
      }

      const dragListId = item.listId;
      const dragIndex = item.index;

      item.index = cardIndex;

      moveCard(item, dragListId, card.listId, dragIndex, cardIndex);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  const handleClick = useCallback((): void => {
    showTaskDetails('c', card.id);
  }, [card.id, showTaskDetails]);

  return (
    <Card
      ref={ref}
      onClick={handleClick}
      className={clsx(
        'cursor-pointer hover:opacity-80',
        isTaskSelected('c', card.id) && 'opacity-80 outline outline-primary',
        isOver && 'opacity-0'
      )}
    >
      <Typography
        title={card.title}
        className="line-clamp-3 whitespace-pre-wrap p-1.5"
      >
        {card.title}
      </Typography>
    </Card>
  );
});

export default TaskCard;
