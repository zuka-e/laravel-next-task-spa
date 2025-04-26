import { memo, useCallback, useRef, type JSX } from 'react';
import dynamic from 'next/dynamic';
import { type DropIndicatorProps } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { Typography } from '@mui/material';
import clsx from 'clsx';

import { useSortable } from '@/lib/dnd/hooks';
import { useTaskDetails } from '@/lib/hooks';
import type * as Model from '@/store/api/services/tasks/models';

/**
 * ※ In case of normal import, an error will happens.
 *
 * Error: Failed to load external module @atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box: SyntaxError: Unexpected token '.'
 *
 * [externals]/@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box [external] (@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box, cjs)
 *
 * WARN  Issues with peer dependencies found
 * .
 * └─┬ @atlaskit/pragmatic-drag-and-drop-react-drop-indicator 3.1.0
 *   └─┬ @atlaskit/tokens 4.8.0
 *     ├── ✕ unmet peer react@^18.2.0: found 19.1.0
 *     ├─┬ @atlaskit/platform-feature-flags 1.1.1
 *     │ └─┬ @atlaskit/feature-gate-js-client 5.0.0
 *     │   └─┬ @atlaskit/atlassian-context 0.2.0
 *     │     └── ✕ unmet peer react@^18.2.0: found 19.1.0
 *     └─┬ @atlaskit/ds-lib 4.0.0
 *       └── ✕ unmet peer react@^18.2.0: found 19.1.0
 */
const DropIndicator = dynamic<DropIndicatorProps>(
  () =>
    import('@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box').then(
      (mod) => mod.default,
    ),
  { ssr: false },
);

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

  const { isDragging, closestEdge } = useSortable({
    draggableRef,
    draggableItem: {
      isDraggable: true,
      type: 'item',
      id: card.id,
      index,
      parentId: card.listId,
    },
    dropzoneRef,
    droppableItem: {
      isDroppable: true,
      type: 'item',
      id: card.id,
      index,
    },
  });

  return (
    <div ref={dropzoneRef} onClick={handleClick} className="px-2 py-1">
      <div
        ref={draggableRef}
        className={clsx(
          'relative p-2 cursor-pointer bg-white rounded-md hover:opacity-80',
          isTaskSelected('c', card.id) && 'opacity-80 outline outline-primary',
          isDragging && 'opacity-50',
        )}
        title={card.title}
      >
        <Typography className="line-clamp-3 whitespace-pre-wrap p-1.5">
          {card.title}
        </Typography>
        {closestEdge && <DropIndicator edge={closestEdge} />}
      </div>
    </div>
  );
});

export default TaskCard;
