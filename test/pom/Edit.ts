import type { FrameLocator, Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Edit extends pom.EditPanel {
  readonly page: Page;
  readonly placeholder: Locator;
  readonly codeEditor: Locator;
  readonly codeInput: Locator;
  readonly previewFrame: FrameLocator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.placeholder = this.editor.getByText('Raw HTML component');
    this.codeEditor = this.editor.locator('.cm-editor');
    this.codeInput = this.codeEditor.locator('.cm-content');
    this.previewFrame = this.editor.frameLocator('iframe[title="Preview"]');
  }

  async typeCode(code: string) {
    await this.codeInput.click();
    await this.codeInput.pressSequentially(code);
  }

  // Blur triggers save; the PATCH is async, so wait for it to be persisted
  // before e.g. reloading the page (otherwise the request gets cancelled).
  async blurAndWaitForSave() {
    const saved = this.page.waitForResponse(
      (res) =>
        res.request().method() === 'PATCH' &&
        res.url().includes('/content-element/'),
    );
    await this.codeInput.blur();
    await saved;
  }
}
