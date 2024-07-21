import { type DefaultBodyType, type StrictRequest } from 'msw';

import type {
  CursorPaginationResponse,
  UpdateTaskCardRequest,
} from '@/store/api';
import type { TaskBoard, TaskCard, TaskList } from '@test/api/database/models';
import db from '@test/api/database/manager';
import { cursorPaginate } from '@test/api/http/responses/paginate';

export const index = (
  listId: TaskList['id'],
  request: StrictRequest<DefaultBodyType>
): CursorPaginationResponse<TaskCard> => {
  const cards = db.taskCard.findMany({
    where: { listId: { equals: listId } },
  });

  return cursorPaginate({ request, filtered: cards });
};

export const store = (
  listId: TaskList['id'],
  params: Partial<Omit<TaskCard, 'id' | 'listId'>>
): TaskCard => {
  return db.taskCard.create({ listId, ...params });
};

export const show = (id: TaskCard['id']): TaskCard | null => {
  return db.taskCard.findFirst({ where: { id: { equals: id } } });
};

export const update = (
  id: UpdateTaskCardRequest['id'],
  params: Omit<UpdateTaskCardRequest, 'id'>
): TaskCard | null => {
  const card = db.taskCard.findFirst({ where: { id: { equals: id } } });

  if (!card) {
    return null;
  }

  if (typeof params.index === 'number') {
    const listId = params.listId ?? card.listId;
    const cards = db.taskCard
      .findMany({
        where: { listId: { equals: listId } },
      })
      .filter((data) => data.id !== card.id)
      .sort((a, b) => {
        if (a.sequence < b.sequence) return -1;
        if (a.sequence > b.sequence) return 1;
        return 0;
      });

    const prevCardSequence =
      params.index > 0 ? cards[params.index - 1]?.sequence : 0;
    const nextCardSequence = cards[params.index]?.sequence;
    let sequence = Math.round(
      nextCardSequence
        ? ((prevCardSequence ?? 0) + (nextCardSequence ?? 0)) / 2
        : (cards.at(-1)?.sequence ?? 0) + 2 ** 10
    );

    // Reorder if duplicated
    if ([prevCardSequence, nextCardSequence].includes(sequence)) {
      cards.forEach((card, i) => {
        card.sequence = (i + 1) * 2 ** 10;
        db.taskCard.update({ where: { id: { equals: card.id } }, data: card });
      });

      // Recalculate sequence
      const prevCardSequence =
        params.index > 0 ? cards[params.index - 1]?.sequence : 0;
      const nextCardSequence = cards[params.index]?.sequence;

      sequence = Math.round(
        nextCardSequence
          ? ((prevCardSequence ?? 0) + (nextCardSequence ?? 0)) / 2
          : 2 ** 10
      );
    }

    params.sequence = sequence;
  }

  return db.taskCard.update({ where: { id: { equals: id } }, data: params });
};

export const destroy = (id: TaskCard['id']): TaskCard | null => {
  return db.taskCard.delete({ where: { id: { equals: id } } });
};

export const search = (id: TaskBoard['id'], q: string): TaskCard[] => {
  const listIds = db.taskList
    .findMany({ where: { boardId: { equals: id } } })
    .map((list) => list.id);

  return db.taskCard
    .findMany({
      where: { listId: { in: listIds } },
    })
    .filter(
      (card) =>
        new RegExp(q, 'i').test(card.title) ||
        new RegExp(q, 'i').test(card.content ?? '')
    );
};
