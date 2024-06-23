import { type DefaultBodyType, type StrictRequest } from 'msw';

import type { TaskBoard, TaskCard, TaskList } from '@/models';
import { type UpdateTaskCardRequest } from '@/store/api';
import { db } from '@test/api/database';
import { cursorPaginate } from '@test/utils/paginate';

export const index = (
  listId: TaskList['id'],
  request: StrictRequest<DefaultBodyType>
) => {
  const cards = db.where(
    'taskCards',
    'listId',
    listId
  ) as unknown as TaskCard[];

  return cursorPaginate({ request, filtered: cards });
};

export const store = (
  listId: TaskList['id'],
  params: Partial<Omit<TaskCard, 'id' | 'listId'>>
) => {
  const newCard = db.create('taskCards', {
    listId,
    ...params,
  });

  const response: TaskCard = { ...newCard };

  return response;
};

export const show = (id: TaskCard['id']) => {
  const card = db.where('taskCards', 'id', id)[0];

  if (!card) return;

  return card as unknown as TaskCard;
};

export const update = (
  id: UpdateTaskCardRequest['id'],
  params: Omit<UpdateTaskCardRequest, 'id'>
) => {
  const card = db.where('taskCards', 'id', id)[0];

  if (!card) return;

  if (typeof params.index === 'number') {
    const listId = params.listId ?? card.listId;
    const cards = db
      .where('taskCards', 'listId', listId)
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
        db.update('taskCards', { ...card });
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

  const updated = db.update('taskCards', { ...card, ...params });

  const response: TaskCard = { ...updated };

  return response;
};

export const destroy = (id: TaskCard['id']) => {
  const deleted = db.remove('taskCards', id);

  if (!deleted) return;

  const response: TaskCard = { ...deleted };

  return response;
};

export const search = (id: TaskBoard['id'], q: string) => {
  const listIds = db.where('taskLists', 'boardId', id).map((list) => list.id);

  return db
    .whereIn('taskCards', 'listId', listIds)
    .filter(
      (card) =>
        new RegExp(q, 'i').test(card.title) ||
        new RegExp(q, 'i').test(card.content)
    );
};
