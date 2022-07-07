// example.spec.ts
import { test, expect, Page } from '@playwright/test';
import { initPayloadTest } from '../../helpers/configHelpers';
import { login } from '../helpers';

let serverURL: string;

test.describe('it should load the admin ui', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    // Go to the starting url before each test.
    ({ serverURL } = await initPayloadTest({
      __dirname,
      init: {
        local: false,
      },
    }));

    const context = await browser.newContext();
    page = await context.newPage();

    await login({ page, serverURL });
  });

  test('should be redirected to dashboard', async () => {
    await expect(page).toHaveURL(`${serverURL}/admin`);
    await expect(page.locator('.dashboard__wrap')).toBeVisible();
  });
});