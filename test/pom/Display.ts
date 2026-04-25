import type { FrameLocator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Display extends pom.DisplayPanel {
  readonly contentFrame: FrameLocator;

  constructor(page: Page) {
    super(page);
    this.contentFrame = this.editor.frameLocator('iframe[title="Preview"]');
  }
}
