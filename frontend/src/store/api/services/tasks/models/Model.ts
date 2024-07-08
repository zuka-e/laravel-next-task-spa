/**
 * Base model
 */
type Model<T> = {
  id: string;
  createdAt: string;
  updatedAt: string;
} & { [K in keyof T]: T[K] };

export default Model;
