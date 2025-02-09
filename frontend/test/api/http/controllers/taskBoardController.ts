import { type DefaultBodyType, type StrictRequest } from 'msw';

import type {
  FetchKanbanBoardResponse,
  MoveTaskCardRequest,
  MoveTaskCardResponse,
  PaginationResponse,
} from '@/store/api';
import { paginate } from '@test/api/http/responses/paginate';
import type { TaskBoard, TaskList } from '@test/api/database/models';
import db from '@test/api/database/manager';
import { getUser } from '@test/api/auth';
import { getQuery } from '@test/api/http/utils/urls';

export const index = (
  userId: TaskBoard['userId'],
  request: StrictRequest<DefaultBodyType>
): PaginationResponse<TaskBoard> => {
  const boards = db.taskBoard.findMany({
    where: { userId: { equals: userId } },
  });

  return paginate({ request, filtered: boards });
};

export const store = (
  params: Partial<Omit<TaskBoard, 'id' | 'userId'>>
): TaskBoard => {
  return db.taskBoard.create({ userId: getUser()!.id, ...params });
};

export const show = (
  id: TaskBoard['id'],
  request: StrictRequest<DefaultBodyType>
): TaskBoard | FetchKanbanBoardResponse['data'] | null => {
  const asKanban = getQuery(request).get('asKanban');

  if (!asKanban) {
    return db.taskBoard.findFirst({ where: { id: { equals: id } } });
  }

  const board = db.taskBoard.findFirst({
    where: { id: { equals: id } },
  });

  if (!board) {
    return null;
  }

  const lists = db.taskList.findMany({
    where: { boardId: { equals: id } },
  });

  const cards = db.taskCard.findMany({
    where: { listId: { in: lists.map((list) => list.id) } },
  });

  return {
    board,
    lists,
    cards,
  };
};

export const update = (
  id: TaskBoard['id'],
  params: Partial<Omit<TaskBoard, 'id' | 'userId'>>
): TaskBoard | null => {
  return db.taskBoard.update({ where: { id: { equals: id } }, data: params });
};

export const destroy = (id: TaskBoard['id']): TaskBoard | null => {
  return db.taskBoard.delete({ where: { id: { equals: id } } });
};

export const moveCard = (
  params: Omit<MoveTaskCardRequest, 'boardId'>
): MoveTaskCardResponse['data'] | null => {
  const { cardId, srcListId, destListId, srcIndex, destIndex } = params;

  const card = db.taskCard.findFirst({ where: { id: { equals: cardId } } });

  if (!card || card.listId !== srcListId) {
    return null;
  }

  const srcList = db.taskList.findFirst({
    where: { id: { equals: srcListId } },
  });

  if (!srcList) {
    return null;
  }

  const destList = db.taskList.findFirst({
    where: { id: { equals: destListId } },
  });

  if (!destList) {
    return null;
  }

  if (srcList.cardIds[srcIndex] !== cardId) {
    return null;
  }

  const newSrcCardIds = [...srcList.cardIds];
  const [removedCardId] = newSrcCardIds.splice(srcIndex, 1);

  const newDestCardIds =
    srcListId === destListId ? newSrcCardIds : [...destList.cardIds];
  newDestCardIds.splice(destIndex, 0, removedCardId);

  const updatedLists: TaskList[] = [];

  const updatedSrcList = db.taskList.update({
    where: { id: { equals: srcListId } },
    data: { cardIds: newSrcCardIds },
  });

  if (!updatedSrcList) {
    return null;
  }

  updatedLists.push(updatedSrcList);

  if (srcListId !== destListId) {
    const updatedDestList = db.taskList.update({
      where: { id: { equals: destListId } },
      data: { cardIds: newDestCardIds },
    });

    if (!updatedDestList) {
      return null;
    }

    updatedLists.push(updatedDestList);

    const updatedCard = db.taskCard.update({
      where: { id: { equals: cardId } },
      data: { listId: destListId },
    });

    if (!updatedCard) {
      return null;
    }

    return {
      lists: updatedLists,
      card: updatedCard,
    };
  }

  return {
    lists: updatedLists,
  };
};
