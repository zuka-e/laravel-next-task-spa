import { test, expect, type Page } from '@playwright/test';
import faker from 'faker';

import { assertScreenshot } from './utils';

test.beforeEach(async ({ page }) => {
  await page.goto('/register');
});

/** Fill out and submit the form */
const submitWithInput = async (
  page: Page,
  email: string,
  password: string
): Promise<void> => {
  await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
  await page.getByLabel('Password *').fill(password);
  await page.getByLabel('Password Confirmation *').fill(password);
  await page.keyboard.press('Enter');
};

test.describe('Registration form', () => {
  assertScreenshot();

  test('can register', async ({ page }) => {
    await submitWithInput(
      page,
      faker.unique(faker.internet.exampleEmail),
      'password'
    );

    // prettier-ignore
    await Promise.all([
      expect(page).toHaveURL('/email-verification'),
      expect(page.getByRole('alert').filter({ hasText: 'ユーザー登録が完了しました' })).toBeVisible(),
      expect(page.getByRole('heading', { name: '認証用メールを送信しました。' })).toBeVisible(),
      expect(page.getByRole('button', { name: '再送信する' })).toBeVisible(),
    ]);
  });

  test('cannot register with existing email', async ({ page }) => {
    const existingEmail = 'test@example.com';

    await submitWithInput(page, existingEmail, 'password');

    // prettier-ignore
    await Promise.all([
      expect(page).toHaveURL('/register'),
      expect(page.getByRole('alert').filter({ hasText: /メールアドレスは既に/ })).toBeVisible(),
    ])
  });
});
