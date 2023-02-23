import { test, expect, type Page } from '@playwright/test';
import faker from 'faker';

import { assertScreenshot } from './utils';

test.beforeEach(async ({ page }) => {
  await page.goto('/register');
});

test.describe('Registration form', () => {
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
    await page.getByLabel('Password Confirmation *').fill(password);
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

  test('cannot register with invalid input', async ({ page }) => {
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

    await submit(page, { email: 'test@example', password: 'pass' });

    await Promise.all([
      expect(page).toHaveURL('/register'),
      expect(errors.email.email).toBeVisible(),
      expect(errors.password.min).toBeVisible(),
    ]);
  });

  test('can register', async ({ page }) => {
    await submit(page, {
      email: faker.unique(faker.internet.exampleEmail),
      password: 'password',
    });

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

    await submit(page, { email: existingEmail, password: 'password' });

    // prettier-ignore
    await Promise.all([
      expect(page).toHaveURL('/register'),
      expect(page.getByRole('alert').filter({ hasText: /メールアドレスは既に/ })).toBeVisible(),
    ])
  });
});

test.describe('links', () => {
  test('has link to the login page', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/login');
  });
});
