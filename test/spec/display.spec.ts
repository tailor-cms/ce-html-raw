import { expect, test } from '@playwright/test';
import { elementClient } from '@tailor-cms/cek-e2e';

import { Display } from '../pom';

const ELEMENT_ID = 'test-html-raw-display';

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await elementClient.resetState(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('Empty state', () => {
  test('Renders placeholder when content is empty', async ({ page }) => {
    const display = new Display(page);
    await expect(display.placeholder).toBeVisible();
  });
});

test.describe('Content rendering', () => {
  test('Renders HTML inside iframe', async ({ page }) => {
    await elementClient.update(ELEMENT_ID, {
      content: '<p>Hello <strong>world</strong></p>',
    });
    await page.reload({ waitUntil: 'networkidle' });
    const display = new Display(page);
    await expect(
      display.contentFrame.locator('p', { hasText: 'Hello' }),
    ).toBeVisible();
    await expect(display.contentFrame.locator('strong')).toHaveText('world');
  });

  test('Renders headings, lists, and tables', async ({ page }) => {
    await elementClient.update(ELEMENT_ID, {
      content: [
        '<h1>Title</h1>',
        '<ul><li>a</li><li>b</li></ul>',
        '<table><tbody><tr><td>cell</td></tr></tbody></table>',
      ].join(''),
    });
    await page.reload({ waitUntil: 'networkidle' });
    const display = new Display(page);
    await expect(display.contentFrame.locator('h1')).toHaveText('Title');
    await expect(display.contentFrame.locator('ul > li')).toHaveCount(2);
    await expect(display.contentFrame.locator('table td')).toHaveText('cell');
  });
});
