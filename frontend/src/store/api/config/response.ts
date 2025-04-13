/**
 * Possible severities of API responses.
 */
export const SEVERITIES = ['error', 'warning', 'info', 'success'] as const;

/**
 * Severities that should trigger a notification.
 */
export const NOTIFIABLE = [
  'error',
  'warning',
  'success',
] as const satisfies Readonly<(typeof SEVERITIES)[number][]>;
