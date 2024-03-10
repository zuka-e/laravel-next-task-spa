/**
 * Check if the current environment matches the given env.
 */
export const envIs = (env: NodeJS.Process['env']['NODE_ENV']): boolean => {
  return process.env.NODE_ENV === env;
};
