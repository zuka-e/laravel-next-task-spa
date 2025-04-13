import { z } from 'zod';

export const APP_URL = z
  .string()
  .url()
  .parse(process.env['NEXT_PUBLIC_APP_URL']);

export const APP_NAME = z.string().parse(process.env['NEXT_PUBLIC_APP_NAME']);

export const GUEST_NAME = 'ゲストユーザー';
export const GUEST_EMAIL = 'test@example.com';
export const GUEST_PASSWORD = 'password';
