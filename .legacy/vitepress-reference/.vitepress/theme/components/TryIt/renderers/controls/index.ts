export { default as ControlWrapper } from './ControlWrapper.vue'
export { default as StringControlRenderer } from './StringControlRenderer.vue'
export { default as MultiStringControlRenderer } from './MultiStringControlRenderer.vue'
export { default as NumberControlRenderer } from './NumberControlRenderer.vue'
export { default as IntegerControlRenderer } from './IntegerControlRenderer.vue'
export { default as EnumControlRenderer } from './EnumControlRenderer.vue'
export { default as oneOfEnumControlRenderer } from './EnumOneOfControlRenderer.vue'
export { default as DateControlRenderer } from './DateControlRenderer.vue'
export { default as DateTimeControlRenderer } from './DateTimeControlRenderer.vue'
export { default as TimeControlRenderer } from './TimeControlRenderer.vue'
export { default as BooleanControlRenderer } from './BooleanControlRenderer.vue'

import {
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
} from './entries'

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
]
