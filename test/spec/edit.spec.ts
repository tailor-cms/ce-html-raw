import { expect, test } from '@playwright/test';
import { elementClient } from '@tailor-cms/cek-e2e';

import { Edit } from '../pom';

const ELEMENT_ID = 'test-html-raw-edit';

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('Initial render', () => {
  test('Shows placeholder when empty and unfocused', async ({ page }) => {
    const edit = new Edit(page);
    await expect(edit.placeholder).toBeVisible();
    await expect(edit.codeEditor).not.toBeVisible();
  });

  test('Mounts code editor on focus', async ({ page }) => {
    const edit = new Edit(page);
    await edit.focus();
    await expect(edit.codeEditor).toBeVisible();
    await expect(edit.placeholder).not.toBeVisible();
  });
});

test.describe('Renders pre-seeded content', () => {
  test('Shows content in preview iframe', async ({ page }) => {
    await elementClient.update(ELEMENT_ID, {
      content: '<p>Hello <strong>world</strong></p>',
    });
    await page.reload({ waitUntil: 'networkidle' });
    const edit = new Edit(page);
    await expect(
      edit.previewFrame.locator('p', { hasText: 'Hello' }),
    ).toBeVisible();
    await expect(edit.previewFrame.locator('strong')).toHaveText('world');
  });
});

test.describe('Typing', () => {
  test('Updates preview iframe as code is typed', async ({ page }) => {
    const edit = new Edit(page);
    await edit.focus();
    await edit.typeCode('<p>live preview</p>');
    await expect(
      edit.previewFrame.locator('p', { hasText: 'live preview' }),
    ).toBeVisible();
  });
});

test.describe('Sanitization', () => {
  test('Strips disallowed script tag on save', async ({ page }) => {
    const edit = new Edit(page);
    await edit.focus();
    await edit.typeCode('<script>alert(1)</script><p>safe</p>');
    // Blur CodeMirror to trigger synchronous save → sanitize
    await edit.codeInput.blur();
    await page.reload({ waitUntil: 'networkidle' });
    await expect(
      edit.previewFrame.locator('p', { hasText: 'safe' }),
    ).toBeVisible();
    await expect(edit.previewFrame.locator('script')).toHaveCount(0);
  });

  test('Strips iframe and style tags', async ({ page }) => {
    const edit = new Edit(page);
    await edit.focus();
    await edit.typeCode(
      '<iframe src="x"></iframe><style>body{color:red}</style><p>keep</p>',
    );
    await edit.codeInput.blur();
    await page.reload({ waitUntil: 'networkidle' });
    await expect(edit.previewFrame.locator('iframe')).toHaveCount(0);
    await expect(edit.previewFrame.locator('style')).toHaveCount(0);
    await expect(
      edit.previewFrame.locator('p', { hasText: 'keep' }),
    ).toBeVisible();
  });
});

test.describe('Readonly mode', () => {
  test('Hides code editor but keeps preview', async ({ page }) => {
    await elementClient.update(ELEMENT_ID, {
      content: '<p>Locked content</p>',
    });
    await page.reload({ waitUntil: 'networkidle' });
    const edit = new Edit(page);
    await edit.setReadonly();
    await edit.focus();
    await expect(edit.codeEditor).not.toBeVisible();
    await expect(
      edit.previewFrame.locator('p', { hasText: 'Locked content' }),
    ).toBeVisible();
  });
});

test.afterAll(async () => {
  await elementClient.reset(ELEMENT_ID);
});
