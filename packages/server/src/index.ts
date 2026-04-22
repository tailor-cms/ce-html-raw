import { ai, initState, type } from '@tailor-cms/ce-html-raw-manifest';
import type { HookMap, ServerModule } from '@tailor-cms/cek-common';
import type { Element } from '@tailor-cms/ce-html-raw-manifest';

export const hookMap: HookMap<Element> = new Map();

const serverModule: ServerModule<Element> = {
  type,
  initState,
  hookMap,
  ai,
};

export default serverModule;
export { type, initState, ai };
