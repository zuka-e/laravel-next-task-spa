import { useEffect, useState, type RefObject } from 'react';
import {
  attachClosestEdge,
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
        onDragLeave: () => {
          setIsDraggedOver(false);
        },
        onDrop: () => {
          setIsDraggedOver(false);
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

  return { isDragging, isDraggedOver };
};

export default useSortable;
