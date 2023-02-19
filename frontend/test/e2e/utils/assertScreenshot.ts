import { test, expect } from '@playwright/test';

/** Take a snapshot at every breakpoint and compare with the expected. */
const assertScreenshot = (options?: { only?: true }): void => {
  const breakpoints = [600, 900, 1200, 1536] as const;
  const widths = [599, ...breakpoints] as const;
  const it = options?.only ? test.only : test;

  widths.map(async (width): Promise<void> => {
    it(`snapshot (width:${width})`, async ({ page }): Promise<void> => {
      // The screenshot option's `fullPage: true` expands height to the end of page.
      await page.setViewportSize({ width, height: 0 });

      // cf. https://playwright.dev/docs/test-snapshots
      // cf. https://playwright.dev/docs/api/class-pageassertions#page-assertions-to-have-screenshot-2
      await expect(page).toHaveScreenshot(`w${width}.png`, {
        timeout: 10 * 1000,
        fullPage: true,
      });
    });
  });
};

export default assertScreenshot;
