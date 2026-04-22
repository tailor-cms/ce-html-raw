import type { FrameLocator, Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Edit extends pom.EditPanel {
  readonly placeholder: Locator;
  readonly codeEditor: Locator;
  readonly codeInput: Locator;
  readonly previewFrame: FrameLocator;

  constructor(page: Page) {
    super(page);
    this.placeholder = this.editor.getByText('Raw HTML component');
    this.codeEditor = this.editor.locator('.cm-editor');
    this.codeInput = this.codeEditor.locator('.cm-content');
    this.previewFrame = this.editor.frameLocator('iframe[title="Preview"]');
  }

  async typeCode(code: string) {
    await this.codeInput.click();
    await this.codeInput.pressSequentially(code);
  }
}
