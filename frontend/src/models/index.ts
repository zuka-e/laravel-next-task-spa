/**
 * 動的プロパティ`DocumentBase`を付与
 */
export interface CollectionBase<T extends DocumentBase> {
  [uuid: string]: T;
}

/**
 * `extends`した`interface`及び交差させた`type`に必須プロパティを付与
 */
export interface DocumentBase {
  id: string;
  createdAt: string;
  updatedAt: string;
  index?: number;
}

export * from './Task';
