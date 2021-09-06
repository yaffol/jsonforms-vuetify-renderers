import { arrayRenderers } from './array';
import { controlRenderers } from './controls';
import { labelRenderers } from './label';
import { layoutRenderers } from './layouts';
import { complexRenderers } from './complex';

export const vuetifyRenderers = [
  ...controlRenderers,
  ...layoutRenderers,
  ...arrayRenderers,
  ...labelRenderers,
  ...complexRenderers,
];
