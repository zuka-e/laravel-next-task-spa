import { useEffect, useState, type RefObject } from 'react';
import {
  attachClosestEdge,
  type Edge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import type { DroppableItem } from '@/lib/dnd/entities';

/**
 * Make the element droppable.
 */
const useDroppable = (args: {
  dropzoneRef: RefObject<HTMLElement | null>;
  droppableItem: DroppableItem;
  draggableRef?: RefObject<HTMLElement | null>;
  allowedEdges?: Edge[];
}) => {
  const {
    dropzoneRef,
    draggableRef,
    droppableItem,
    allowedEdges = ['top', 'bottom'],
  } = args;

  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    if (!dropzoneRef.current) {
      return;
    }

    return combine(
      dropTargetForElements({
        element: dropzoneRef.current,
        onDragStart: () => {
          setIsDraggedOver(true);
        },
        onDragEnter: () => {
          setIsDraggedOver(true);
        },
        onDragLeave: () => {
          setIsDraggedOver(false);
        },
        onDrop: () => {
          setIsDraggedOver(false);
        },
        getData: ({ input, element }) => {
          return attachClosestEdge(droppableItem, {
            input,
            element: draggableRef?.current ?? element,
            allowedEdges,
          });
        },
      }),
    );
  }, [dropzoneRef, draggableRef, droppableItem, allowedEdges]);

  return { isDraggedOver };
};

export default useDroppable;
