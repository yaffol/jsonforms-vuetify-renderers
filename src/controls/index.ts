export { default as ControlWrapper } from './ControlWrapper.vue';
export { default as StringControlRenderer } from './StringControlRenderer.vue';
export { default as MultiStringControlRenderer } from './MultiStringControlRenderer.vue';
export { default as NumberControlRenderer } from './NumberControlRenderer.vue';
export { default as IntegerControlRenderer } from './IntegerControlRenderer.vue';
export { default as EnumControlRenderer } from './EnumControlRenderer.vue';
export { default as oneOfEnumControlRenderer} from './EnumOneOfControlRenderer.vue';
export { default as DateControlRenderer} from './DateControlRenderer.vue';
export { default as DateTimeControlRenderer} from './DateTimeControlRenderer.vue';
export { default as TimeControlRenderer} from './TimeControlRenderer.vue';
export { default as BooleanControlRenderer } from './BooleanControlRenderer.vue'
export { default as BooleanToggleControlRenderer } from './BooleanToggleControlRenderer.vue'
export { default as PasswordControlRenderer } from './PasswordControlRenderer.vue'
export { default as SliderControlRenderer } from './SliderControlRenderer.vue'
export { default as RadioEnumControlRenderer } from './RadioEnumControlRenderer.vue'
export { default as RadioEnumOneOfControlRenderer } from './RadioEnumOneOfControlRenderer.vue'

import { entry as stringControlRendererEntry } from './StringControlRenderer.vue';
import { entry as multiStringControlRendererEntry } from './MultiStringControlRenderer.vue';
import { entry as numberControlRendererEntry } from './NumberControlRenderer.vue';
import { entry as integerControlRendererEntry } from './IntegerControlRenderer.vue';
import { entry as enumControlRendererEntry } from './EnumControlRenderer.vue';
import { entry as oneOfEnumControlRendererEntry } from './EnumOneOfControlRenderer.vue';
import { entry as dateControlRendererEntry } from './DateControlRenderer.vue';
import { entry as dateTimeControlRendererEntry } from './DateTimeControlRenderer.vue';
import { entry as timeControlRendererEntry } from './TimeControlRenderer.vue';
import { entry as booleanControlRendererEntry} from './BooleanControlRenderer.vue';
import { entry as booleanToggleControlRendererEntry} from './BooleanToggleControlRenderer.vue';
import { entry as passwordControlRendererEntry} from './PasswordControlRenderer.vue';
import { entry as sliderControlRendererEntry} from './SliderControlRenderer.vue';
import { entry as radioEnumControlRenderer} from './RadioEnumControlRenderer.vue';
import { entry as radioEnumOneOfControlRenderer} from './RadioEnumOneOfControlRenderer.vue';

export const controlRenderers = [
  stringControlRendererEntry,
  multiStringControlRendererEntry,
  numberControlRendererEntry,
  integerControlRendererEntry,
  enumControlRendererEntry,
  oneOfEnumControlRendererEntry,
  dateControlRendererEntry,
  dateTimeControlRendererEntry,
  timeControlRendererEntry,
  booleanControlRendererEntry,
  booleanToggleControlRendererEntry,
  passwordControlRendererEntry,
  sliderControlRendererEntry,
  radioEnumControlRenderer,
  radioEnumOneOfControlRenderer
]
