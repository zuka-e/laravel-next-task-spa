/**
 * Get the previous URL from sessionStorage.
 */
export const getPreviousUrl = (): string | null => {
  return sessionStorage.getItem('previousUrl');
};

/**
 * Set the previous URL in sessionStorage.
 */
export const setPreviousUrl = (url: string): void => {
  sessionStorage.setItem('previousUrl', url);
};

/**
 * Get the intended URL from sessionStorage.
 */
export const getIntendedUrl = (): string | null => {
  return sessionStorage.getItem('intendedUrl');
};

/**
 * Set the intended URL in sessionStorage.
 */
export const setIntendedUrl = (url: string): void => {
  sessionStorage.setItem('intendedUrl', url);
};

/**
 * Remove the intended URL from sessionStorage.
 */
export const removeIntendedUrl = (): void => {
  sessionStorage.removeItem('intendedUrl');
};

/**
 * Pull the intended URL from sessionStorage and remove it.
 */
export const pullIntendedUrl = (): string | null => {
  const intendedUrl = getIntendedUrl();

  removeIntendedUrl();

  return intendedUrl;
};
