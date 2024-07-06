import { modelDictionary } from './definitions';
import db from './manager';

/**
 * Model object
 */
type Attributes<T extends keyof typeof modelDictionary> = NonNullable<
  ReturnType<typeof db[T]['findFirst']>
>;

export type Session = Attributes<'session'>;

export type User = Attributes<'user'>;

export type TaskBoard = Attributes<'taskBoard'>;

export type TaskList = Attributes<'taskList'>;

export type TaskCard = Attributes<'taskCard'>;
