export { default as LayoutRenderer } from './LayoutRenderer.vue';
export { default as GroupRenderer } from './GroupRenderer.vue';
export { default as CategorizationRenderer } from './CategorizationRenderer.vue';

import { entry as layoutRendererEntry } from './LayoutRenderer.vue';
import { entry as groupRendererEntry} from './GroupRenderer.vue';
import { entry as categorizationRendererEntry} from './CategorizationRenderer.vue';

export const layoutRenderers = [
  layoutRendererEntry,
  groupRendererEntry,
  categorizationRendererEntry
]
