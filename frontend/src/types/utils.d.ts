/**
 * Get the value of the key.
 */
export type ValueOf<T> = T[keyof T];

/**
 * Get the type of the value that the guard function returns.
 *
 * @example
 * ```ts
 * type AxiosError = GuardType<typeof isAxiosError>;
 * ```
 */
export type GuardType<T> = T extends (x: unknown) => x is infer U ? U : never;
