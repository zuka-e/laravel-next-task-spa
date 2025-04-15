import { memo, useCallback, useRef, type JSX } from 'react';
import { Typography } from '@mui/material';
import clsx from 'clsx';

import { DND_ENTITY_TYPE } from '@/lib/dnd/entities';
import { useSortable } from '@/lib/dnd/hooks';
import { useTaskDetails } from '@/lib/hooks';
import type * as Model from '@/store/api/services/tasks/models';

type TaskCardProps = {
  card: Pick<Model.TaskCard, 'id' | 'listId' | 'title'>;
  index: number;
};

const TaskCard = memo(function TaskCard(props: TaskCardProps): JSX.Element {
  const { card, index } = props;
  const { showTaskDetails, isTaskSelected } = useTaskDetails();

  const draggableRef = useRef<HTMLDivElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((): void => {
    showTaskDetails('c', card.id);
  }, [card.id, showTaskDetails]);

  const { isDragging, isDraggedOver } = useSortable({
    draggableRef,
    draggableItem: {
      isDraggable: true,
      type: DND_ENTITY_TYPE.ITEM,
      id: card.id,
      index,
      parentId: card.listId,
    },
    dropzoneRef,
    droppableItem: {
      isDroppable: true,
      type: DND_ENTITY_TYPE.ITEM,
      id: card.id,
      index,
    },
  });

  return (
    <div
      ref={dropzoneRef}
      onClick={handleClick}
      className={clsx('px-2 py-1', isDragging && 'opacity-50')}
    >
      <div
        ref={draggableRef}
        className={clsx(
          'p-2 cursor-pointer bg-white rounded-md hover:opacity-80',
          isTaskSelected('c', card.id) && 'opacity-80 outline outline-primary',
          isDraggedOver && 'bg-gray-100',
        )}
        title={card.title}
      >
        <Typography className="line-clamp-3 whitespace-pre-wrap p-1.5">
          {card.title}
        </Typography>
      </div>
    </div>
  );
});

export default TaskCard;
