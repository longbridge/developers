import { JsonFormsRendererRegistryEntry, rankWith, uiTypeIs } from '@jsonforms/core'
import LabelRenderer from './LabelRenderer.vue'

export const labelRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: LabelRenderer,
  tester: rankWith(1, uiTypeIs('Label')),
}
