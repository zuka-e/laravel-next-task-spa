import { test, expect, type Page } from '@playwright/test';

import { assertScreenshot } from './utils';

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
});

test.describe('Login form', () => {
  assertScreenshot();

  /** Fill out and submit the form */
  const submit = async (
    page: Page,
    input: {
      email: string;
      password: string;
    }
  ): Promise<void> => {
    const { email, password } = input;
    await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
    await page.getByLabel('Password *').fill(password);
    await page.keyboard.press('Enter');
  };

  test('toggles password visibility with checkbox', async ({ page }) => {
    const formItem = { password: page.getByLabel('Password *') } as const;
    const passwordDisplayOption = page.getByRole('checkbox', {
      name: 'Show Password',
    });

    await expect(formItem.password).not.toHaveAttribute('type', 'text');

    await passwordDisplayOption.click({ force: true });

    expect(await passwordDisplayOption.isChecked()).toBe(true);
    await expect(formItem.password).toHaveAttribute('type', 'text');

    await passwordDisplayOption.click({ force: true });

    expect(await passwordDisplayOption.isChecked()).toBe(false);
    await expect(formItem.password).not.toHaveAttribute('type', 'text');
  });

  test('cannot login with invalid input', async ({ page }) => {
    const errors = {
      email: {
        email: page.getByText('Email Address must be a valid email'),
      },
      password: {
        min: page.getByText('Password must be at least 8 characters'),
      },
    };

    await Promise.all([
      expect(errors.email.email).not.toBeVisible(),
      expect(errors.password.min).not.toBeVisible(),
    ]);

    await submit(page, { email: 'test@example.', password: 'passwd1' });

    await Promise.all([
      expect(page).toHaveURL('/login'),
      expect(errors.email.email).toBeVisible(),
      expect(errors.password.min).toBeVisible(),
    ]);
  });

  test('can login with valid credentials', async ({ page }) => {
    await submit(page, { email: 'test@example.com', password: 'password' });

    // prettier-ignore
    await Promise.all([
      expect(page).toHaveURL('/'),
      expect(page.getByRole('alert').filter({ hasText: 'ログインしました' })).toBeVisible(),
    ]);
  });

  test('cannot login without valid credentials', async ({ page }) => {
    await submit(page, { email: 'test@example.com', password: 'password!' });

    // prettier-ignore
    await Promise.all([
      expect(page).toHaveURL('/login'),
      expect(page.getByRole('alert').filter({ hasText: '認証に失敗しました。' })).toBeVisible(),
    ])
  });
});

test.describe('links', () => {
  test('has link to the forgot-password page', async ({ page }) => {
    await page.getByRole('button', { name: 'Forgot password?' }).click();
    await expect(page).toHaveURL('/forgot-password');
  });

  test('has link to the registration page', async ({ page }) => {
    await page.getByRole('button', { name: 'Create an account' }).click();
    await expect(page).toHaveURL('/register');
  });
});
