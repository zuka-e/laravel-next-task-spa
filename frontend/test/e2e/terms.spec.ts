import { test } from '@playwright/test';

import { assertScreenshot } from './utils';

test.beforeEach(async ({ page }) => {
  await page.goto('/terms');
});

assertScreenshot();
