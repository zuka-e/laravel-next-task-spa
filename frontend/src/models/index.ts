/**
 * `extends`した`interface`及び交差させた`type`に必須プロパティを付与
 */
export interface DocumentBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export * from './Task';
export * from './User';
