import { useEffect, useMemo, useState, type RefObject } from 'react';
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

import type { DndItem, DraggableItem, DroppableItem } from '@/lib/dnd/entities';
import type { Axis, DndEntityType } from '@/lib/dnd/types';
import { getAllowedEdgesByAxis } from '@/lib/dnd/utils';

/**
 * Make the element draggable and droppable.
 */
const useSortable = <T extends DndEntityType>({
  draggableRef,
  dropzoneRef,
  data,
  axis = 'vertical',
}: {
  draggableRef: RefObject<HTMLElement | null>;
  dropzoneRef: RefObject<HTMLElement | null>;
  data: DndItem<T>;
  axis?: Axis;
}) => {
  const draggableItem = useMemo((): DraggableItem => {
    return {
      ...data,
      isDraggable: true,
    };
  }, [data]);

  const droppableItem = useMemo((): DroppableItem => {
    return {
      ...data,
      isDroppable: true,
    };
  }, [data]);

  const allowedEdges = useMemo((): Edge[] => {
    return getAllowedEdgesByAxis(axis);
  }, [axis]);

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
        canDrop: (args) => {
          return args.source.data['type'] === data.type;
        },
        onDragStart: () => {
          setIsDraggedOver(true);
        },
        onDragEnter: () => {
          setIsDraggedOver(true);
        },
        onDrag: (args) => {
          if (args.source.data['id'] === data.id) {
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
          return allowedEdges
            ? attachClosestEdge(droppableItem, {
                input,
                element,
                allowedEdges,
              })
            : droppableItem;
        },
      }),
    );
  }, [
    draggableRef,
    dropzoneRef,
    draggableItem,
    droppableItem,
    data.type,
    data.id,
    allowedEdges,
  ]);

  return { isDragging, isDraggedOver, closestEdge };
};

export default useSortable;
