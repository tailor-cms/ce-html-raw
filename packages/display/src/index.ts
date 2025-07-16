import baseManifest from '@tailor-cms/ce-html-raw-manifest';
import type { ElementManifest } from '@tailor-cms/ce-html-raw-manifest';

import Display from './components/Display.vue';

const manifest: ElementManifest = {
  ...baseManifest,
  Display,
};

export default manifest;
export { Display };
