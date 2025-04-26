import { type DefaultBodyType, type StrictRequest } from 'msw';

import type {
  FetchKanbanBoardResponse,
  MoveTaskCardRequest,
  MoveTaskCardResponse,
  MoveTaskListRequest,
  MoveTaskListResponse,
  PaginationResponse,
} from '@/store/api';
import { getUser } from '@test/api/auth';
import db from '@test/api/database/manager';
import type { TaskBoard, TaskList } from '@test/api/database/models';
import { paginate } from '@test/api/http/responses/paginate';
import { getQuery } from '@test/api/http/utils/urls';

export const index = (
  userId: TaskBoard['userId'],
  request: StrictRequest<DefaultBodyType>,
): PaginationResponse<TaskBoard> => {
  const boards = db.taskBoard.findMany({
    where: { userId: { equals: userId } },
  });

  return paginate({ request, filtered: boards });
};

export const store = (
  params: Partial<Omit<TaskBoard, 'id' | 'userId'>>,
): TaskBoard => {
  return db.taskBoard.create({ userId: getUser()!.id, ...params });
};

export const show = (
  id: TaskBoard['id'],
  request: StrictRequest<DefaultBodyType>,
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
  params: Partial<Omit<TaskBoard, 'id' | 'userId'>>,
): TaskBoard | null => {
  return db.taskBoard.update({ where: { id: { equals: id } }, data: params });
};

export const destroy = (id: TaskBoard['id']): TaskBoard | null => {
  return db.taskBoard.delete({ where: { id: { equals: id } } });
};

export const moveList = (
  id: TaskBoard['id'],
  params: Omit<MoveTaskListRequest, 'boardId'>,
): MoveTaskListResponse['data'] | null => {
  const { srcIndex, destIndex, listId } = params;

  const board = db.taskBoard.findFirst({
    where: { id: { equals: id } },
  });

  if (!board) {
    console.log('board not exist.');
    return null;
  }

  const listIds = [...board.listIds];
  const [removedListId] = listIds.splice(srcIndex, 1);

  if (removedListId !== listId) {
    console.error('listId not match.');
    return null;
  }

  listIds.splice(
    destIndex === -1 ? listIds.length : destIndex,
    0,
    removedListId,
  );

  const updatedBoard = db.taskBoard.update({
    where: { id: { equals: id } },
    data: { listIds },
  });

  if (!updatedBoard) {
    console.error("board couldn't be updated.");
    return null;
  }

  return {
    board: updatedBoard,
  };
};

export const moveCard = (
  params: Omit<MoveTaskCardRequest, 'boardId'>,
): MoveTaskCardResponse['data'] | null => {
  const { cardId, srcListId, destListId, srcIndex, destIndex } = params;

  const card = db.taskCard.findFirst({ where: { id: { equals: cardId } } });

  if (!card) {
    console.error('card not exist.');
    return null;
  }

  if (card.listId !== srcListId) {
    console.error('listId not match', card.listId, srcListId);
    return null;
  }

  const srcList = db.taskList.findFirst({
    where: { id: { equals: srcListId } },
  });

  if (!srcList) {
    console.error('srcList not exist.');
    return null;
  }

  const destList = db.taskList.findFirst({
    where: { id: { equals: destListId } },
  });

  if (!destList) {
    console.error('destList not exist.');
    return null;
  }

  if (srcList.cardIds[srcIndex] !== cardId) {
    console.error('cardId not exist.', srcList.cardIds[srcIndex], cardId);
    return null;
  }

  const newSrcCardIds = [...srcList.cardIds];
  const [removedCardId] = newSrcCardIds.splice(srcIndex, 1);

  if (!removedCardId) {
    console.error('removedCardId not exist.');
    return null;
  }

  const newDestCardIds =
    srcListId === destListId ? newSrcCardIds : [...destList.cardIds];
  newDestCardIds.splice(
    destIndex === -1 ? newDestCardIds.length : destIndex,
    0,
    removedCardId,
  );

  const updatedLists: TaskList[] = [];

  const updatedSrcList = db.taskList.update({
    where: { id: { equals: srcListId } },
    data: { cardIds: newSrcCardIds },
  });

  if (!updatedSrcList) {
    console.error('updatedSrcList not exist.');
    return null;
  }

  updatedLists.push(updatedSrcList);

  if (srcListId !== destListId) {
    const updatedDestList = db.taskList.update({
      where: { id: { equals: destListId } },
      data: { cardIds: newDestCardIds },
    });

    if (!updatedDestList) {
      console.error('updatedDestList not exist.');
      return null;
    }

    updatedLists.push(updatedDestList);

    const updatedCard = db.taskCard.update({
      where: { id: { equals: cardId } },
      data: { listId: destListId },
    });

    if (!updatedCard) {
      console.error('updatedCard not exist.');
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
