export { default as LayoutRenderer } from './LayoutRenderer.vue';
export { default as GroupRenderer } from './GroupRenderer.vue';
export { default as CategorizationRenderer } from './CategorizationRenderer.vue';
export { default as CategorizationStepperRenderer } from './CategorizationStepperRenderer.vue';

import { entry as layoutRendererEntry } from './LayoutRenderer.vue';
import { entry as groupRendererEntry} from './GroupRenderer.vue';
import { entry as categorizationRendererEntry} from './CategorizationRenderer.vue';
import { entry as categorizationStepperRendererEntry} from './CategorizationStepperRenderer.vue';

export const layoutRenderers = [
  layoutRendererEntry,
  groupRendererEntry,
  categorizationRendererEntry,
  categorizationStepperRendererEntry
]
