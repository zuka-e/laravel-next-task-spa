import { z } from 'zod';

import type { Routes } from '@/types/routes';

export const API_HOST = z
  .string()
  .url()
  .parse(process.env['NEXT_PUBLIC_API_HOST']);

export const API_VERSION = z
  .string()
  .parse(process.env['NEXT_PUBLIC_API_VERSION']);

export const API_BASE_URL = `${API_HOST}/${API_VERSION}`;

export const API_ENDPOINTS = {
  AUTH: {
    CSRF_TOKEN: '/csrf-cookie',
    SESSION: '/session',
    SIGNUP: '/register',
    DELETE_ACCOUNT: '/register',
    LOGIN: '/login',
    LOGOUT: '/logout',
    UPDATE_PROFILE: '/user/profile-information',
    UPDATE_PASSWORD: '/user/password',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password/:token',
    VERIFICATION_NOTIFICATION: '/email/verification-notification',
    VERIFY_EMAIL: '/email/verify/:token/:hash',
  },
  TASKS: {
    BOARDS: {
      INDEX: '/boards',
      CREATE: '/boards',
      SHOW: '/boards/:boardId',
      UPDATE: '/boards/:boardId',
      DESTROY: '/boards/:boardId',
      AS_KANBAN: '/boards/:boardId?asKanban=1',
      MOVE_LIST: '/boards/:boardId/move-list',
      MOVE_CARD: '/boards/:boardId/move-card',
      LISTS: {
        INDEX: '/boards/:boardId/lists',
        CREATE: '/boards/:boardId/lists',
      },
      CARDS: {
        SEARCH: '/boards/:boardId/search',
      },
    },
    LISTS: {
      SHOW: '/lists/:listId',
      UPDATE: '/lists/:listId',
      DESTROY: '/lists/:listId',
      REORDER_CARDS: '/lists/:listId/reorder-cards',
      CARDS: {
        INDEX: '/lists/:listId/cards',
        CREATE: '/lists/:listId/cards',
      },
    },
    CARDS: {
      SHOW: '/cards/:cardId',
      UPDATE: '/cards/:cardId',
      DESTROY: '/cards/:cardId',
    },
  },
} as const satisfies Routes;
