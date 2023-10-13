import type { CollectionBase, DocumentBase } from '@/models';

/**
 * Session key of CSRF token.
 */
const CSRF_TOKEN = '_token';

export type Session = {
  userId?: string;
  [CSRF_TOKEN]?: string;
} & DocumentBase;

export type SessionCollection = CollectionBase<Session>;
