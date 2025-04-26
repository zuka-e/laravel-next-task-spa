import { useEffect, useMemo, useState, type RefObject } from 'react';
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import type { DndItem, DroppableItem } from '@/lib/dnd/entities';
import type { Axis, DndEntityType } from '@/lib/dnd/types';
import { getAllowedEdgesByAxis } from '@/lib/dnd/utils';

/**
 * Make the element droppable.
 */
const useDroppable = ({
  ref,
  data,
  allowedEntities,
  axis = 'vertical',
  dropzoneRef,
}: {
  ref: RefObject<HTMLElement | null>;
  data: DndItem;
  allowedEntities: DndEntityType[];
  axis?: Axis;
  dropzoneRef?: RefObject<HTMLElement | null>;
}) => {
  const droppableItem = useMemo((): DroppableItem => {
    return {
      ...data,
      isDroppable: true,
    };
  }, [data]);

  const allowedEdges = useMemo((): Edge[] => {
    return getAllowedEdgesByAxis(axis);
  }, [axis]);

  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    return combine(
      dropTargetForElements({
        element: dropzoneRef?.current ?? ref.current,
        canDrop: (args) => {
          return allowedEntities.includes(
            args.source.data['type'] as DndEntityType,
          );
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
          return attachClosestEdge(droppableItem, {
            input,
            element,
            allowedEdges,
          });
        },
      }),
    );
  }, [ref, droppableItem, data.id, allowedEntities, dropzoneRef, allowedEdges]);

  return { isDraggedOver, closestEdge };
};

export default useDroppable;
