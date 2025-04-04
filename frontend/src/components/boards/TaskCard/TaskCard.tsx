import {
  memo,
  useCallback,
  type JSX,
  useRef,
  useEffect,
  useState,
} from 'react';

import clsx from 'clsx';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

import { Typography } from '@mui/material';

import type * as Model from '@/store/api/services/tasks/models';
import {
  DND_ENTITY_TYPE,
  type DraggableItem,
  type DroppableItem,
} from '@/lib/dnd/entities';
import { useTaskDetails } from '@/lib/hooks';

type TaskCardProps = {
  card: Pick<Model.TaskCard, 'id' | 'listId' | 'title'>;
  index: number;
};

const TaskCard = memo(function TaskCard(props: TaskCardProps): JSX.Element {
  const { card, index } = props;
  const { showTaskDetails, isTaskSelected } = useTaskDetails();
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const draggableRef = useRef<HTMLDivElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((): void => {
    showTaskDetails('c', card.id);
  }, [card.id, showTaskDetails]);

  useEffect(() => {
    if (!draggableRef.current || !dropzoneRef.current) return;

    return combine(
      draggable({
        element: draggableRef.current,
        getInitialData: (): DraggableItem =>
          ({
            isDraggable: true,
            type: DND_ENTITY_TYPE.ITEM,
            id: card.id,
            index,
            parentId: card.listId,
          }) as const,
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element: dropzoneRef.current,
        onDragStart: () => setIsDraggedOver(true),
        onDragEnter: () => setIsDraggedOver(true),
        onDragLeave: () => setIsDraggedOver(false),
        onDrop: () => setIsDraggedOver(false),
        getData: ({ input, element }) => {
          const data: DroppableItem = {
            isDroppable: true,
            type: DND_ENTITY_TYPE.ITEM,
            id: card.id,
            index,
          } as const;

          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['top', 'bottom'],
          });
        },
      }),
    );
  }, [card.id, card.listId, index]);

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
