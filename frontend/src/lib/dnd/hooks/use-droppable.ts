import { useEffect, useState, type RefObject } from 'react';
import {
  attachClosestEdge,
  extractClosestEdge,
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
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

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
        onDrag: (args) => {
          if (args.source.data['id'] === droppableItem.id) {
            return;
          }

          const closestEdge =
            args.location.current.dropTargets[0]?.data['type'] ===
            args.self.data['type']
              ? extractClosestEdge(args.self.data)
              : null;

          setClosestEdge(closestEdge);
        },
        onDragLeave: () => {
          setIsDraggedOver(false);
          setClosestEdge(null);
        },
        onDrop: () => {
          setIsDraggedOver(false);
          setClosestEdge(null);
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

  return { isDraggedOver, closestEdge };
};

export default useDroppable;
