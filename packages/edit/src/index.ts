import baseManifest from 'tce-manifest';
import type { ElementManifest } from 'tce-manifest';

import Edit from './components/Edit.vue';

const manifest: ElementManifest = {
  ...baseManifest,
  Edit,
};

export default manifest;
export { Edit };
