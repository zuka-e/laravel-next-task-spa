type NodeEnv = NodeJS.Process['env']['NODE_ENV'];

/**
 * Checks if the current Node.js environment matches one of the given environment(s).
 *
 * @param env - The Node environment(s) to check against. Can be a string or array of strings.
 * @returns Whether the current Node.js environment matches the given environment(s).
 */
export const envIs = (env: NodeEnv | NodeEnv[]): boolean => {
  if (Array.isArray(env)) {
    return env.includes(process.env.NODE_ENV);
  }

  return process.env.NODE_ENV === env;
};
