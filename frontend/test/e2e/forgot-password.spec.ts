import { test, expect, type Page } from '@playwright/test';

import { assertScreenshot } from './utils';

test.beforeEach(async ({ page }) => {
  await page.goto('/forgot-password');
});

test.describe('Forgot-Password form', () => {
  assertScreenshot();

  /** Fill out and submit the form */
  const submit = async (
    page: Page,
    input: { email: string }
  ): Promise<void> => {
    const { email } = input;
    await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
    await page.keyboard.press('Enter');
  };

  /** Get error messages for each input */
  const getErrors = (page: Page) => ({
    email: {
      email: page.getByText('Email Address must be a valid email'),
    },
  });

  test('cannot submit with invalid input', async ({ page }) => {
    await Promise.all([expect(getErrors(page).email.email).not.toBeVisible()]);

    await submit(page, { email: 'test@example.' });

    await Promise.all([
      expect(page).toHaveURL('/forgot-password'),
      expect(getErrors(page).email.email).toBeVisible(),
    ]);
  });

  test('can submit with valid input', async ({ page }) => {
    await submit(page, { email: 'test@example.com' });

    // prettier-ignore
    await Promise.all([
      expect(page).toHaveURL('/forgot-password'),
      expect(getErrors(page).email.email).not.toBeVisible(),
      expect(page.getByRole('alert').filter({ hasText: '送信しました' })).toBeVisible(),
    ]);
  });
});

test.describe('links', () => {
  test('has link to the login page', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/login');
  });
});
