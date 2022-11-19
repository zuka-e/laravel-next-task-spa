import { useRef } from 'react';

import { useDrag, useDrop } from 'react-dnd';
import { Card, Typography } from '@mui/material';

import * as Model from 'models';
import { draggableItem, DragItem } from 'utils/dnd';
import { useAppDispatch, useAppSelector } from 'utils/hooks';
import { activateEventAttr as activateInfoBoxEventAttr } from 'utils/infoBox';
import { moveCard, openInfoBox } from 'store/slices/taskBoardSlice';

type TaskCardProps = {
  card: Model.TaskCard;
  cardIndex: number;
  listIndex: number;
};

const TaskCard = (props: TaskCardProps) => {
  const { card, cardIndex, listIndex } = props;
  const selectedId = useAppSelector((state) => state.boards.infoBox.data?.id);
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag<DragItem, unknown, unknown>({
    type: draggableItem.card,
    item: {
      id: card.id,
      listId: card.listId,
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

      // 位置不変の場合
      if (dragIndex === hoverIndex && dragListIndex === hoverListIndex) return;

      const boardId = card.boardId;
      dispatch(
        moveCard({
          dragListIndex,
          hoverListIndex,
          dragIndex,
          hoverIndex,
          boardId,
        })
      );

      item.index = hoverIndex;
      item.listIndex = hoverListIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  const isSelected = () => card.id === selectedId;

  const handleClick = () => {
    if (isSelected()) activateInfoBoxEventAttr('shown');
    else dispatch(openInfoBox({ model: 'card', data: card }));
  };

  return (
    <Card
      ref={ref}
      onClick={handleClick}
      className={
        'cursor-pointer hover:opacity-80' +
        (isSelected() ? ' opacity-80 outline outline-primary ' : ' ') +
        (isOver ? 'opacity-0' : '')
      }
    >
      <Typography
        title={card.title}
        className="whitespace-pre-wrap p-1.5 line-clamp-3"
      >
        {card.title}
      </Typography>
    </Card>
  );
};

export default TaskCard;
