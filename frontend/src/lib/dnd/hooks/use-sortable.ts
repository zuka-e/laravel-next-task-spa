import { useEffect, useState, type RefObject } from 'react';
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import type { DraggableItem, DroppableItem } from '@/lib/dnd/entities';

/**
 * Make the element draggable and droppable.
 */
const useSortable = (args: {
  draggableRef: RefObject<HTMLElement | null>;
  dropzoneRef: RefObject<HTMLElement | null>;
  draggableItem: DraggableItem;
  droppableItem: DroppableItem;
  allowedEdges?: Edge[];
}) => {
  const {
    draggableRef,
    dropzoneRef,
    draggableItem,
    droppableItem,
    allowedEdges = ['top', 'bottom'],
  } = args;

  const [isDragging, setIsDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    if (!draggableRef.current || !dropzoneRef.current) return;

    return combine(
      draggable({
        element: draggableRef.current,
        getInitialData: () => {
          return draggableItem;
        },
        onDragStart: () => {
          setIsDragging(true);
        },
        onDrop: () => {
          setIsDragging(false);
        },
      }),
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
            element,
            allowedEdges,
          });
        },
      }),
    );
  }, [draggableRef, dropzoneRef, draggableItem, droppableItem, allowedEdges]);

  return { isDragging, isDraggedOver, closestEdge };
};

export default useSortable;
