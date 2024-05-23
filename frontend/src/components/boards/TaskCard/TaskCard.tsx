import { memo, useCallback, useRef } from 'react';

import clsx from 'clsx';
import { useDrag, useDrop } from 'react-dnd';
import { Card, Typography } from '@mui/material';

import * as Model from '@/models';
import { draggableItem, DragItem } from '@/utils/dnd';
import { useAppDispatch } from '@/utils/hooks';
import { useTaskDetails } from '@/lib/hooks';
import { taskCardApi } from '@/store/api';

type TaskCardProps = {
  card: Model.TaskCard;
  cardIndex: number;
  listIndex: number;
};

const TaskCard = memo(function TaskCard(props: TaskCardProps): JSX.Element {
  const { card, cardIndex, listIndex } = props;
  const dispatch = useAppDispatch();
  const { showTaskDetails, isTaskSelected } = useTaskDetails();
  const ref = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag<DragItem, unknown, unknown>({
    type: draggableItem.card,
    item: {
      ...card,
      index: cardIndex,
      listIndex: listIndex,
    },
  });

  /** リスト内のカードの移動を司る */
  const [{ isOver }, drop] = useDrop({
    accept: draggableItem.card,
    hover: (item: DragItem) => {
      if (!ref.current) return;

      const dragListIndex = item.listIndex;
      const hoverListIndex = listIndex;
      const dragIndex = item.index;
      const hoverIndex = cardIndex;

      item.index = hoverIndex;

      // 位置不変の場合
      if (dragListIndex === hoverListIndex) {
        if (dragIndex === hoverIndex) {
          return;
        }

        dispatch(
          taskCardApi.util.updateQueryData(
            'getTaskCards',
            { listId: item.listId },
            (draft) => {
              draft.data.splice(dragIndex, 1);
              draft.data.splice(hoverIndex, 0, { ...item });
            }
          )
        );

        return;
      }

      dispatch(
        taskCardApi.util.updateQueryData(
          'getTaskCards',
          { listId: item.listId },
          (draft) => {
            draft.data.splice(dragIndex, 1);
          }
        )
      );

      item.listId = card.listId;
      item.listIndex = hoverListIndex;

      dispatch(
        taskCardApi.util.updateQueryData(
          'getTaskCards',
          { listId: item.listId },
          (draft) => {
            draft.data.splice(hoverIndex, 0, { ...item });
          }
        )
      );
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
